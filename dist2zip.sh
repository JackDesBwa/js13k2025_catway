#!/bin/sh

ZIPNAME=catway.zip

rm -f $ZIPNAME
cd dist
7z a -tzip -mx=9 -mpass=50 ../$ZIPNAME **/* *
cd ..
du -b $ZIPNAME
du -bh $ZIPNAME

echo $(( 13312 - $(du -b $ZIPNAME | sed "s/$ZIPNAME//" ) )) bytes left
