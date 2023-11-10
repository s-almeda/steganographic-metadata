'''
by Shm
borrows ideas from: https://elisklar.medium.com/imagehash-easy-steganography-240b92b586e2
'''

###TODOS:
###     Fix decode button, fix Reset Button, have it display user's image, clean code

import qrcode
import random
from PIL import Image
import numpy as np
import sys

#The first index in sys argv is the argument we passed before
userInputedData = sys.argv[1]

def generateQRCode(data, QRImageName='qr2.png'):
    path = "public/images/"
    img = qrcode.make(data)
    img = img.resize((200,200))
    img.save(path + QRImageName)
    print("Done with creating the QR Code: "+ data)
    return img

def embedQRCode(imageName):
    qr = generateQRCode(userInputedData) 
    pixelMap = qr.load()

    # --- create a 2D numpy array of 0s and 1s based on qr code, 0 = black, 1 = white --- #
    qr_binary_array = np.zeros((qr.size[0],qr.size[1]), dtype=int)

    # cycle through all pixels in qr image
    for i in range(qr.size[0]):
        for j in range(qr.size[1]):
            # add '1' if pixel is white, '0' to array if pixel is black.
            # doing it this way makes it so we can use QR codes that might have some gray pixels in them
            if pixelMap[i,j] > 200:
                qr_binary_array[i,j] = 1
            else:
                qr_binary_array[i,j] = 0


    # open image to be encoded
    img = Image.open('public/upload/' + imageName) #path to image you're encoding
    pixelMap = img.load()

    # -- encode image by changing the R value of each pixel, if necesary, to make it even/odd based on the qr code -- #

    for i in range(qr_binary_array.shape[0]):
        for j in range(qr_binary_array.shape[1]):
            if qr_binary_array[i,j] == 1: #QR code pixel is white! make sure xRGB is odd!
                if xRGB(pixelMap[i,j]) % 2 == 0: #it is NOT odd! let's change it! (subtract 1 from R)
                    pixelMap[i,j] = (pixelMap[i,j][0]-1, pixelMap[i,j][1], pixelMap[i,j][2])
            else: #QR code pixel is black! make sure xRGB is even!
                if xRGB(pixelMap[i,j]) % 2 == 1: #it is NOT even! let's change it (subtract 1 from R)
                    pixelMap[i,j] = (pixelMap[i,j][0]-1, pixelMap[i,j][1], pixelMap[i,j][2])

    img.save('images/shimage_encoded.png') # save encoded image here - MUST BE PNG to avoid compression
    print("Saved the encoded image")

    # -- decode and display the OG image (will not have qr code) and the encoded image (will show qr code) --#
    #revealEncoding('images/shimageLQ.jpg')
    revealEncoding('images/shimage_encoded.png')

def xRGB(rgba): #converts RGB value to xRGB value (sums the R+G+B)
    sum = 0
    for i in rgba:
        sum += i
    return sum

def revealEncoding(imgpath): # -- this function takes an image path, converts pixels to B/W using the xRGB decoding method, and displays the image -- # 
    print("Decoding the image")
    img = Image.open(imgpath)
    pixelMap = img.load()
    decoded = Image.new('1', (img.size[0], img.size[1]))
    for i in range(img.size[0]):
        for j in range(img.size[1]):
            if xRGB(pixelMap[i,j]) % 2 == 0:
                decoded.putpixel((i,j), 0)
            else:
                decoded.putpixel((i,j), 1)
    
    img.show()
    decoded.show()
    print("Decoded shown!")


def main():
    embedQRCode("bart.jpg")
    print("Done running the Python Script")

if __name__ == "__main__":
    main()
