# python -m pip install --upgrade pip
# python -m pip install --upgrade Pillow
# Or python3

# Imports
from PIL import Image, ImageDraw

# Config
width = 2560
height = 1440

# Creating new image object (background)
img  = Image.new( mode = "RGB", size = (width, height), color = (35, 3, 64) )
draw = ImageDraw.Draw(img)

# Drawing within image
shape = [(0, 0), (width, 30)]
draw.rectangle(
  shape,
  fill=(255, 255, 255),
  outline=(0, 0, 0)
) 

# shape = [(0, height), (0, height - 40), (width, height), (width, height - 40)]  # [(x0, y0), (x1, y1), etc.]
# draw.polygon(
#   shape, 
#   fill=(35, 3, 64),
#   outline=(0, 0, 0)
# )

# Show image
# img.show()

# Save image
img.save("img1.png","PNG")