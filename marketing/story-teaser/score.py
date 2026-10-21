"""Soundtrack for the Inhale Exhale teaser, synthesised from the film's own timeline (60 fps).

Every effect is tied to a picture event: fragment resolves get a soft pluck, the breath gets air,
the flip gets a whoosh and a shimmer (the payoff), the fan gets card riffles, and the lockup gets one
clean bell after a stop-down. A pad in A minor carries the whole piece and breathes with the orb.
"""
import wave
import numpy as np

SR = 48000
FPS = 60
INTRO = 540
TOTAL_F = INTRO + 900
N = int(TOTAL_F / FPS * SR)
rng = np.random.default_rng(7)


def t_of(frame):
    return frame / FPS


def idx(frame):
    return int(round(frame / FPS * SR))


L = np.zeros(N)
R = np.zeros(N)


def add(sig, at_frame, gain=1.0, pan=0.0):
    i = idx(at_frame)
    n = min(len(sig), N - i)
    if n <= 0:
        return
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    L[i:i + n] += sig[:n] * gain * l * np.sqrt(2)
    R[i:i + n] += sig[:n] * gain * r * np.sqrt(2)


def env_exp(n, attack=0.004, tau=0.25):
    t = np.arange(n) / SR
    a = np.clip(t / attack, 0, 1)
    return a * np.exp(-t / tau)


def onepole_lp(x, cutoff):
    """Time-varying one-pole low-pass; cutoff may be an array (Hz)."""
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    s = 0.0
    for i in range(len(x)):
        s = (1 - a[i]) * x[i] + a[i] * s
        y[i] = s
    return y


def pluck(freq, dur=0.6, tau=0.18, bright=0.35):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.sin(2 * np.pi * freq * t) + bright * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t / 0.05)
    return sig * env_exp(n, 0.003, tau)


def bell(freq, dur=3.0, tau=1.1):
    n = int(dur * SR)
    t = np.arange(n) / SR
    partials = [(1, 1.0), (2.76, 0.42), (5.4, 0.2), (8.93, 0.08)]
    sig = sum(a * np.sin(2 * np.pi * freq * k * t) * np.exp(-t / (tau / (1 + k * 0.4))) for k, a in partials)
    return sig * np.clip(t / 0.002, 0, 1)


def noise_burst(dur, lo, hi_curve, tau):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    y = onepole_lp(x, hi_curve if np.ndim(hi_curve) else np.full(n, hi_curve))
    y = y - onepole_lp(y, lo)
    return y * env_exp(n, 0.002, tau)


# --- Pad: A minor (A2 E3 A3 C4), breathing with the orb, brighter after the reveal, filtered down for the lockup.
t = np.arange(N) / SR
f_ax = t * FPS  # frame index per sample
pad = np.zeros(N)
for freq, amp in [(110, 0.5), (164.81, 0.35), (220, 0.3), (261.63, 0.22)]:
    for det in (-0.6, 0.6):
        pad += amp * np.sin(2 * np.pi * (freq + det) * t + rng.uniform(0, 6))
bright = np.zeros(N)
for freq, amp in [(329.63, 0.18), (440, 0.14), (659.25, 0.08)]:
    bright += amp * np.sin(2 * np.pi * freq * t + rng.uniform(0, 6))
g = f_ax - INTRO
breath = np.where(g < -40, 0.75 + 0.12 * np.sin((g + 40) / 40),
         np.where(g < 150, 0.75 + 0.25 * np.clip((g + 40) / 190, 0, 1),
         np.where(g < 270, 1.0 - 0.3 * np.clip((g - 150) / 120, 0, 1), 0.8)))
entry = np.clip(f_ax / 150, 0.35, 1.0)  # enters with intent, 5–10 LU under the body for the first ~2.5 s
reveal = np.clip((g - 441) / 30, 0, 1) * (1 - np.clip((g - 720) / 60, 0, 1))
stopdown = 1 - 0.75 * np.clip((g - 700) / 70, 0, 1)
tail = 1 - np.clip((f_ax - (TOTAL_F - 90)) / 88, 0, 1)
pad_sig = (pad * breath + bright * reveal * 1.2) * entry * stopdown * tail * 0.11
L += pad_sig
R += pad_sig

# --- Story and ritual text: one soft pluck per fragment, on its resolve frame (in + 30).
PENTA = [440, 523.25, 587.33, 659.25, 783.99, 880]
frag_in = [6, 60, 190, 244, 370, 424, INTRO + 6, INTRO + 162, INTRO + 312, INTRO + 594, INTRO + 642]
for k, fin in enumerate(frag_in):
    add(pluck(PENTA[k % len(PENTA)] * (1 if k < 6 else 1.0), 0.7, 0.16), fin + 30, 0.10, pan=(-0.25 if k % 2 else 0.25))

# --- Breath: filtered air rising on the inhale, falling on the exhale.
seg = int((270 + 40) / FPS * SR)
gg = np.arange(seg) / SR * FPS - 40
cut = np.where(gg < 150, 300 + 2600 * np.clip((gg + 40) / 190, 0, 1) ** 1.5, 2900 - 2500 * np.clip((gg - 150) / 120, 0, 1))
air = onepole_lp(rng.standard_normal(seg), cut)
air_env = np.where(gg < 150, np.clip((gg + 40) / 190, 0, 1), 1 - np.clip((gg - 150) / 120, 0, 1)) ** 1.2
add(air * air_env, INTRO - 40, 0.22)

# --- Card back arrives: soft low thump on its settle.
n = int(0.5 * SR)
tt = np.arange(n) / SR
thump = np.sin(2 * np.pi * (70 + 60 * np.exp(-tt / 0.03)) * tt) * env_exp(n, 0.003, 0.12)
add(thump, INTRO + 312, 0.35)

# --- Flip: whoosh rising into the midpoint, then the shimmer (the payoff, loudest moment).
wd = (441 - 400) / FPS + 0.25
n = int(wd * SR)
ramp = np.clip(np.arange(n) / (n - 0.25 * SR), 0, 1)
wh = onepole_lp(rng.standard_normal(n), 400 + 5000 * ramp ** 2)
wh_env = ramp ** 2 * np.exp(-np.clip(np.arange(n) / SR - (n / SR - 0.25), 0, None) / 0.06)
add(wh * wh_env, INTRO + 400, 0.30)
shimmer_notes = [440, 523.25, 659.25, 783.99, 987.77, 1318.5]
for k, fr in enumerate(shimmer_notes):
    add(bell(fr, 3.0, 1.2), INTRO + 441 + k * 4, 0.075, pan=-0.5 + k * 0.2)
add(bell(110, 3.0, 1.6), INTRO + 441, 0.18)

# --- Fan spreading: one soft card riffle per card landing.
for k in range(6):
    add(noise_burst(0.09, 900, 5200, 0.025), INTRO + 560 + k * 9, 0.16, pan=(-0.6 + k * 0.24))

# --- Lockup: stop-down (nothing in the 0.7 s before), then ONE clean bell as the wordmark settles.
add(bell(220, 4.0, 1.8), INTRO + 784, 0.22)
add(bell(330, 4.0, 1.5), INTRO + 784, 0.10, pan=0.2)

# --- Master: gentle bus, peak ceiling −1.5 dBFS, short tail fade to digital zero.
mix = np.stack([L, R], axis=1)
rms = np.sqrt(np.mean(mix ** 2))
mix *= 10 ** (-17 / 20) / rms  # around −17 dBFS RMS (close to −16 LUFS for this material)
mix = np.tanh(mix * 1.2) / 1.2
peak = np.max(np.abs(mix))
ceiling = 10 ** (-1.5 / 20)
if peak > ceiling:
    mix *= ceiling / peak
fade = int(0.08 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
mix[-1] = 0
pcm = (mix * 32767).astype(np.int16)
with wave.open("soundtrack.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote soundtrack.wav", N / SR, "s, peak", round(20 * np.log10(np.max(np.abs(mix))), 2), "dBFS")
