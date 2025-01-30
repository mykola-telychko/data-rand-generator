# data-rand-generator

## DRG

server
 handle api and return random data
 http://localhost:3000/api/generate?name=string&age=number&date=unix&qty=5000

server-stream
 handle api and return random data
    http://localhost:3001/api/generate?number=integer&codelen=10&qty=20 
    http://localhost:3000/api/generate?number=float&codelen=5&qty=50000

tax payer id:
 http://localhost:3001/api/generate?number=integer&codelen=10&qty=2000

server-idpass
 http://localhost:3000/api/generate?number=integer&codelen=7&qty=770&type=idpass

-- slavic-names (bigJSON and combinations)
    alley, street, avenue
    server-addresses

http://localhost:3001/api/list?people=ua 
http://localhost:3001/api/list?people=ua&type=all

------------------
type=passcodes

type=postindexes