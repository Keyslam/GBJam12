uniform Image palettes;
uniform int pal;

vec4 effect( vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords ) {
	float step = 1.f / 8.f;

	vec4 texturecolor = Texel(tex, texture_coords);

	if (all(lessThan(abs(texturecolor - vec4(17.f / 255.f, 3.f / 255.f, 17.f / 255.f, 1.f)), vec4(0.05)))) {
		return Texel(palettes, vec2(0.125, pal * step + step/2.f));
	}

	if (all(lessThan(abs(texturecolor - vec4(93.f / 255.f, 95.f / 255.f, 198.f / 255.f, 1.f)), vec4(0.05)))) {
		return Texel(palettes, vec2(0.375, pal * step + step/2.f));
	}

	if (all(lessThan(abs(texturecolor - vec4(110.f / 255.f, 209.f / 255.f, 138.f / 255.f, 1.f)), vec4(0.05)))) {
		return Texel(palettes, vec2(0.625, pal * step + step/2.f));
	}

	if (all(lessThan(abs(texturecolor - vec4(229.f / 255.f, 233.f / 255.f, 232.f / 255.f, 1.f)), vec4(0.05)))) {
		return Texel(palettes, vec2(0.875, pal * step + step/2.f));

	}


    return texturecolor * color;
}
