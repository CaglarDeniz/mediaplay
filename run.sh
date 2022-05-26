#!/bin/sh

# rm it: Delete container after use
# volume: Mount shared folder
# e LANG.CUTF-8: To get pwntools to stop complaining about UTF8
# security-opt seccomp=unconfined: So GDB can turn off ASLR
docker run -v `pwd`:/mediaplay -p 5000:5000 -p 3000:3000 -it mediaplaycontainer
