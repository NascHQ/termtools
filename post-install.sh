#!/bin/bash

echo ""
echo ""
echo "Termtools has been installed."
echo ""
echo ""

bold=$(tput bold)
normal=$(tput sgr0)

read -p "${bold}Would you like to apply it now?${normal} (y/n)" -n 1 -r
echo    # (optional) move to a new line

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    termtools apply
    echo ""
else
    echo ""
    echo "Ok, just type ${bold}termtools apply${normal} at any time to apply it, or ${bold}termtools restore${normal} to disable it."
    echo ""
fi

