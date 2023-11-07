import qrcode
import time
import random
from PIL import Image

def generateQRCode(data, imageName='qr2.png'):
    path = "public/images/"
    img = qrcode.make(data)
    img = img.resize((200,200))
    img.save(path + imageName)
    time.sleep(2)
    print("done with QR")
    return img


def main():
    string_list = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape"]
    generateQRCode(random.choice(string_list))
    print("hello")

if __name__ == "__main__":
    main()

"""
encodeImage.addEventListener("click", () => {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Process the image - change all pixels to red
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255;     // Red
                data[i + 1] = 0;   // Green
                data[i + 2] = 0;   // Blue
                // Alpha remains the same (data[i + 3])
            }

            ctx.putImageData(imageData, 0, 0);
        });
"""