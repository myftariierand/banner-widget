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

export function createBanner(banner) {
    const { template } = banner

    const isSmDown = window.matchMedia("(max-width: 600px)").matches
    const isMdDown = window.matchMedia("(max-width: 900px)").matches

    const templateData = isSmDown
        ? template.sm
        : isMdDown
        ? template.md
        : template.lg

    const fontFamilies = [
        templateData.date.fontFamily,
        templateData.time.fontFamily,
        templateData.fontTeam1.fontFamily,
        templateData.fontTeam2.fontFamily,
        templateData.button.font,
    ]
        .filter((font) => font !== "")
        .map((font) => `${font}:400`)

    if (fontFamilies.length) {
        WebFont.load({
            google: {
                families: fontFamilies,
            },
        })
    }

    const bannerContainer = document.createElement("div")
    bannerContainer.id = "banner-container"

    if (templateData.background.visible) {
        const background = new Image()
        background.src = `http://betdemo.s3.eu-central-1.amazonaws.com/${templateData.background.media}`
        bannerContainer.appendChild(background)
    }

    if (templateData.date.visible || templateData.time.visible) {
        const dateTime = document.createElement("div")
        dateTime.id = "date-time"

        if (templateData.date.visible) {
            const date = document.createElement("div")
            date.id = "date"
            date.innerText = new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }).format(new Date(banner.schedule))

            const { fontColor, position, fontFamily } = templateData.date
            date.style = `
                color: ${fontColor}; 
                left: ${position[0]}px; 
                top: ${position[1]}px;
                font-family: ${fontFamily};
            `
            dateTime.appendChild(date)
        }

        if (templateData.time.visible) {
            const time = document.createElement("div")
            time.id = "time"
            const date = new Date(banner.schedule)
            const timezoneOffset = date.getTimezoneOffset()
            const adjustedDate = date.getTime() + timezoneOffset * 60000

            time.innerText = new Intl.DateTimeFormat("en-GB", {
                hour: "2-digit",
                minute: "numeric",
                hour12: false,
            }).format(new Date(adjustedDate))

            const { fontColor, position, fontFamily } = templateData.time
            time.style = `
                color: ${fontColor}; 
                left: ${position[0]}px; 
                top: ${position[1]}px;
                font-family: ${fontFamily};
            `
            dateTime.appendChild(time)
        }

        bannerContainer.appendChild(dateTime)
    }

    const teams = document.createElement("div")
    teams.id = "teams"
    const homeTeam = document.createElement("div")
    homeTeam.id = "home-team"
    const awayTeam = document.createElement("div")
    awayTeam.id = "away-team"

    if (templateData.logoTeam1.visible) {
        const homeTeamImg = new Image()
        homeTeamImg.id = "home-team-logo"
        homeTeamImg.src = `http://betdemo.s3.eu-central-1.amazonaws.com/${banner.event[0].image}`

        const { size, position } = templateData.logoTeam1

        const finalWidth = Boolean(size[0]) ? `${size[0]}px` : "114px"
        const finalHeight = Boolean(size[1]) ? `${size[1]}px` : "140px"

        homeTeamImg.style = `
            width: ${finalWidth}; 
            height: ${finalHeight}; 
            left: ${position[0]}px; 
            top: ${position[1]}px;
        `

        homeTeam.appendChild(homeTeamImg)
    }

    if (templateData.logoTeam2.visible) {
        const awayTeamImg = new Image()
        awayTeamImg.id = "away-team-logo"
        awayTeamImg.src = `http://betdemo.s3.eu-central-1.amazonaws.com/${banner.event[1].image}`

        const { size, position } = templateData.logoTeam2

        const finalWidth = Boolean(size[0]) ? `${size[0]}px` : "114px"
        const finalHeight = Boolean(size[1]) ? `${size[1]}px` : "140px"

        awayTeamImg.style = `
            width: ${finalWidth}; 
            height: ${finalHeight}; 
            left: ${position[0]}px; 
            top: ${position[1]}px;
        `

        awayTeam.appendChild(awayTeamImg)
    }

    if (templateData.fontTeam1.visible) {
        const homeTeamTitle = document.createElement("div")
        homeTeamTitle.id = "home-team-title"
        homeTeamTitle.innerText = banner.event[0].name

        const { fontColor, position, fontFamily } = templateData.fontTeam1

        homeTeamTitle.style = `
            color: ${fontColor}; 
            left: ${position[0]}px; 
            top: ${position[1]}px; 
            font-family: ${fontFamily};
        `

        homeTeam.appendChild(homeTeamTitle)
    }

    if (templateData.fontTeam2.visible) {
        const awayTeamTitle = document.createElement("div")
        awayTeamTitle.id = "away-team-title"
        awayTeamTitle.innerText = banner.event[1].name

        const { fontColor, position, fontFamily } = templateData.fontTeam2

        awayTeamTitle.style = `
            color: ${fontColor}; 
            left: ${position[0]}px; 
            top: ${position[1]}px;
            font-family: ${fontFamily};
        `

        awayTeam.appendChild(awayTeamTitle)
    }

    if (templateData.button.visible) {
        const button = document.createElement("a")
        button.id = "button"
        button.innerText = banner.buttonText
        button.href = banner.buttonLink
        button.target = "_blank"

        const {
            background,
            border,
            borderRadius,
            position,
            size,
            textAlign,
            font,
        } = templateData.button

        button.style = `
            background-color: ${background}; 
            border-width: ${border.size}px; 
            border-color: ${border.color}; 
            border-top-left-radius: ${borderRadius[0]}px; 
            border-top-right-radius: ${borderRadius[1]}px; 
            border-bottom-left-radius: ${borderRadius[3]}px; 
            border-bottom-right-radius: ${borderRadius[2]}px; 
            width: ${size[0]}px; 
            height: ${size[1]}px;
            left: ${position[0]}px;
            bottom: ${position[1]}px;
            text-align: ${textAlign};
            font-family: ${font};
        `

        bannerContainer.appendChild(button)
    }

    teams.appendChild(homeTeam)
    teams.appendChild(awayTeam)
    bannerContainer.appendChild(teams)

    bannerContainer.setAttribute("data-id", banner._id)

    return bannerContainer
}
