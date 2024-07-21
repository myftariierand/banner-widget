import { init } from "./banner/main"

function app(window) {
    let configurations = {}

    let globalObject = window[window["JS-Widget"]]
    let queue = globalObject.q
    if (queue) {
        for (var i = 0; i < queue.length; i++) {
            if (queue[i][0].toLowerCase() === "init") {
                configurations = extendObject(configurations, queue[i][1])
                init(configurations)
            }
        }
    }

    globalObject.configurations = configurations
}

function extendObject(a, b) {
    for (var key in b) if (b.hasOwnProperty(key)) a[key] = b[key]
    return a
}

app(window)