/** Points fontconfig (used by sharp's SVG renderer) at the deck fonts. Import before sharp renders text. */
import path from "node:path";

process.env.FONTCONFIG_FILE ??= path.resolve(__dirname, "../../art/fonts/fonts.conf");
