
MAGICB = bytes(("\x41\x54\x54\x52"), 'utf-8')
SEP = bytes(("\x03"), 'utf-8')
EOA = bytes(("\x00"), 'utf-8')

import sys

def tuple2b(list):
    bytelist = SEP
    for entry in list:
        bytelist += bytes((entry[0]), 'utf-8') + SEP + bytes((entry[1]), 'utf-8') + SEP
    return bytelist




if __name__ == "__main__":
    print(1)
    data = (("Author", "Bowser"), ("Source", "example.com"))
    with open(sys.argv[1], 'rb') as infile, open(sys.argv[1] + ".attr", 'wb') as outfile:
        outfile.write(MAGICB)
        outfile.write(tuple2b(data))
        outfile.write(EOA)
        outfile.write(infile.read())