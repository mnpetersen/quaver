#! /usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

npm install
grunt download-atom-shell

"${DIR}/build/atom-shell-darwin/Atom.app/Contents/MacOS/Atom" "${DIR}/app"
#"${DIR}/build/atom-shell-linux/atom" "${DIR}/app"