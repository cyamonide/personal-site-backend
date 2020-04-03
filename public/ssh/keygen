#!/bin/bash
ssh-keygen -b 4096 -t rsa -f ~/.ssh/id_rsa -q -N "" &&
    eval $(ssh-agent -s) &&
    ssh-add ~/.ssh/id_rsa &&
    cat ~/.ssh/id_rsa.pub
