#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  if [ "$HUSKY" = "0" ]; then
    return
  fi
  husky_skip_init=1
  export husky_skip_init
  command="$0"
  shift
  if [ -f ~/.huskyrc ]; then
    . ~/.huskyrc
  fi
  command "$@"
  exit $?
fi
