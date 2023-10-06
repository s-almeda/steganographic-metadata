'''
by Shm
borrows ideas from: https://elisklar.medium.com/imagehash-easy-steganography-240b92b586e2
'''
from PIL import Image

import numpy as np

def main():
    qr = Image.open('images/qr.png') #path to QR Code image go here. 
    qr = qr.resize([300,300]) #did this to try an make it bigger to see if that makes a difference lol
    pixelMap = qr.load()

    # --- create a 2D numpy array of 0s and 1s based on qr code, 0 = black, 1 = white --- #
    qr_binary_array = np.zeros((qr.size[0],qr.size[1]), dtype=int)

    # cycle through all pixels in qr image
    for i in range(qr.size[0]):
        for j in range(qr.size[1]):
            # add '1' if pixel is white, '0' to array if pixel is black.
            # doing it this way makes it so we can use QR codes that might have some gray pixels in them
            if pixelMap[i,j][0] > 200:
                qr_binary_array[i,j] = 1
            else:
                qr_binary_array[i,j] = 0


    # open image to be encoded
    img = Image.open('images/shimageLQ.jpg') #path to image you're encoding
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

    # -- decode and display the OG image (will not have qr code) and the encoded image (will show qr code) --#
    revealEncoding('images/shimageLQ.jpg')
    revealEncoding('images/shimage_encoded.png')
    
def revealEncoding(imgpath): # -- this function takes an image path, converts pixels to B/W using the xRGB decoding method, and displays the image -- # 
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


def showBinaryQR(b_array): # --  function that shows the binary array made from the QR code, just made it to test that i did that right lol --#
    img = Image.new('1', (b_array.shape[0], b_array.shape[1]))
    pixelMap = img.load()
    for i in range(img.size[0]):
        for j in range(img.size[1]):
            pixelMap[i, j] = int(b_array[i,j].astype(int))
    img.show()

def xRGB(rgba): #converts RGB value to xRGB value (sums the R+G+B)
    sum = 0
    for i in rgba:
        sum += i
    return sum


if __name__ == "__main__":
    main()
