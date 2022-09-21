```json
{
  "version": "1.0",
  "name": "test theme",
  "description": "A test theme",
  "theme": {
    "images" : {
      "theme_frame" : "images/theme_frame_camo.png",
      "theme_toolbar" : "images/theme_toolbar_camo.png",
      "theme_ntp_background" : "images/theme_ntp_background_norepeat.png",
      "theme_ntp_attribution" : "images/attribution.png"
    },
    "colors" : {
      "frame" : [71, 105, 91],
      "toolbar" : [207, 221, 192],
      "ntp_text" : [255, 255, 255],
      "ntp_link" : [36, 70, 0],
      "ntp_section" : [207, 221, 192],
      "button_background" : [255, 255, 255]
    },
    "tints" : {
      "buttons" : [0.33, 0.5, 0.47]
    },
    "properties" : {
      "ntp_background_alignment" : "bottom"
    }
  }
}
```
      
version: One to four dot-separated integers identifying the version of this theme.
name: A short, plain text string (no more than 45 characters) that identifies the theme.
description: A description text for your theme.
images: Image resources for this theme. For example, "theme_ntp_background" uses to specify the background of the new tab pane.
colors: Colors are in RGB format, which is used to specify the color of the bookmark text, frame, etc.
tints: You can specify tints to be applied to parts of the UI such as buttons, the frame, and the background tab.
Tints are in Hue-Saturation-Lightness (HSL) format, using floating-point numbers in the range 0 - 1.0: - Hue is an absolute value, with 0 and 1 being red. - Saturation is relative to the currently provided image. 0.5 is no change, 0 is totally desaturated, and 1 is full saturation. - Lightness is also relative, with 0.5 being no change, 0 as all pixels black, and 1 as all pixels white. You can alternatively use -1.0 for any of the HSL values to specify no change.
properties: this field lets you specify properties such as background alignment, background repeat.