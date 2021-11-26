//Dependencies
const Request = require("request")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

//Main
if(!Self_Args.length){
    console.log("node index.js <domain> <output>")
    process.exit()
}

if(Self_Args[0].indexOf("://") != -1){
    console.log("Invalid domain.")
    process.exit()
}

if(!Self_Args[1]){
    console.log("Invalid output.")
    process.exit()
}

console.log("Scanning the website domain for subdomains, please wait because this might take a while.")
Request(`https://crt.sh/?q=${Self_Args[0]}`, {
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36"
    }
}, function(err, res, body){
    let subdomains = []
    let subdomains_found = body.match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g)

    for( i in subdomains_found ){
        if(subdomains.indexOf(subdomains_found[i]) == -1 && subdomains_found[i].indexOf(Self_Args[0]) != -1 && subdomains_found[i] != Self_Args[0]){
            console.log(subdomains_found[i])
            subdomains.push(subdomains_found[i])
        }
    }

    if(!subdomains.length){
        console.log("No subdomains found.")
        process.exit()
    }

    console.log(`${subdomains.length} subdomains found`)
    Fs.writeFileSync(Self_Args[1], subdomains.join("\n"), "utf8")
    console.log(`Subdomains found has been saved to ${Self_Args[1]}`)
})
