
MAGICB = bytes(("\x41\x54\x54\x52"), 'utf-8')
SEP = bytes(("\x03"), 'utf-8')
EOA = bytes(("\x00"), 'utf-8')

from PIL import Image
import tempfile
import sys

def b2tuple(bytelist):
    list = bytelist.split(SEP)
    keys = list[1::2]
    values = list[2::2]
    return tuple(zip(keys, values))


if __name__ == "__main__":
    print(2)
    with open(sys.argv[1], 'rb') as infile:
        filebytes = infile.read()
    cut = filebytes.find(EOA)
    data = filebytes[:cut]
    image = filebytes[cut + 1:]
    print(b2tuple(data))

    tmp = tempfile.NamedTemporaryFile(delete = False)
    try:
        tmp.write(image)
    finally:
        tmp.close()
        i = Image.open(tmp.name)
    
    i.show()