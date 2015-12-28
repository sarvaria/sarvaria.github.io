Chat Server

https://www.npmjs.com/package/nodejs-websocket#ws-connect-url-options-callback
http://www.html5rocks.com/en/tutorials/websockets/basics/?redirect_from_locale=fr

Virtual Room Commands:
======================

REOP - Register operator for work
UNRO - Unregister operator from work
LIFO - List free operators
DIAL - Dial first available operator
SVID - Send video data
RVID - Receive video data
SAUD - Send audio data
RAUD - Receice audio data
PPHO - Pick up the phone
ENDC - End call
SSCA - Start scanning
FSCA - Finish scanning
SPRN - Start printing
FPRN - Finish printing
RAUT - Request authentication
SAUT - Send authentication data
AUVA - Authentication is valid
AUIN - Authentication is invalid
OOWO - Out of work
WAIT - Wait
SMSG - Send message

Command structure:
==================

[Command - 4 bytes][Sender - 20 bytes with spaces][Data]

- Minden regisztrált operátor minden ügyfelet kiszolgál. Az operátor látja, hogy
  melyik ügyféltől jön a hívás.
- Mutatni kell az eltelt időt is a hívás óta.
- Életjelet meg kell jeleníteni, hogy van-e kapcsolat a szerverrel. Ha nincs,
  akkor újra kell kapcsolódni.
- Telefon lerakásnál minden connection -t meg kell szüntetni.
- Telefon hívásakor az operátor nevét akivel az ügyfél beszél ki kell írni.
- Csörgéshangot kell adni a tárcsázáskor.
- A service -t újra kell indítani és újra kell csatlakoztatni ha ledöglene ezért:

events.js:72
        throw er; // Unhandled 'error' event
              ^
Error: read ECONNRESET
    at errnoException (net.js:905:11)
    at TCP.onread (net.js:559:19)
