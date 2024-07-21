export function getDetails() {
    const platform = getOS()
    const device = getDevice()
    const browser = getBrowser()
    const language = getLanguage()

    return {
        device,
        browser,
        platform,
        language,
    }
}

function getLanguage() {
    const locale = navigator.language || navigator.userLanguage

    if (locale) {
        const languageNames = new Intl.DisplayNames(["en"], {
            type: "language",
        })

        return languageNames.of(locale)
    }

    return "Other"
}

function getOS() {
    const userAgent = navigator.userAgent

    if (userAgent.indexOf("Win") !== -1) return "Windows"
    if (userAgent.indexOf("Mac") !== -1) return "MacOS"
    if (userAgent.indexOf("X11") !== -1) return "UNIX"
    if (userAgent.indexOf("Linux") !== -1) return "Linux"
    if (/Android/.test(userAgent)) return "Android"
    if (/iPhone|iPad|iPod/.test(userAgent)) return "iOS"

    return "Other"
}

function getDevice() {
    const userAgent = navigator.userAgent || window.opera

    if (/android/i.test(userAgent)) {
        return "Android Device"
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS Device"
    }

    if (/Samsung|SM-|GT-|SCH-|SGH-|SHV-|SHW-|SPH-|SCH-/i.test(userAgent)) {
        return "Samsung Device"
    }
    if (/Pixel/.test(userAgent)) {
        return "Google Pixel Device"
    }
    if (/Windows Phone/i.test(userAgent)) {
        return "Windows Phone"
    }

    if (/Macintosh|Mac OS X/.test(userAgent)) {
        return "Macintosh"
    }
    if (/Windows NT/.test(userAgent)) {
        return "Windows PC"
    }
    if (/Linux/.test(userAgent)) {
        return "Linux PC"
    }

    return "Other"
}

function getBrowser() {
    const userAgent = navigator.userAgent

    if (/Edg/i.test(userAgent)) {
        return "Edge"
    }
    if (/OPR|Opera/i.test(userAgent)) {
        return "Opera"
    }
    if (/Chrome/i.test(userAgent)) {
        return "Chrome"
    }
    if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
        return "Safari"
    }
    if (/Firefox/i.test(userAgent)) {
        return "Firefox"
    }
    if (/MSIE|Trident/i.test(userAgent)) {
        return "Explorer"
    }

    return "Other"
}
