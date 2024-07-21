const baseURL =
    "https://hexnlzzh3m.execute-api.eu-central-1.amazonaws.com/dev/api/v1"

export async function getBanners(spaceId) {
    try {
        const response = await fetch(`${baseURL}/banners/space/${spaceId}`)
        const banners = await response.json()
        return banners
    } catch (error) {
        return error.response
    }
}

export async function onBannerClick(bannerId, spaceId, skinId, statistics) {
    const body = {
        skinId,
        spaceId,
        bannerId,
        ...statistics,
    }

    if (bannerId && spaceId && skinId) {
        const headers = new Headers()
        headers.append("Content-Type", "application/json")

        fetch(`${baseURL}/views/addclick`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        })
    }
}

export async function onBannerView(bannerId, spaceId, skinId, statistics) {
    const body = {
        skinId,
        spaceId,
        bannerId,
        ...statistics,
    }

    if (bannerId && spaceId && skinId) {
        const headers = new Headers()
        headers.append("Content-Type", "application/json")

        fetch(`${baseURL}/views/addview`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        })
    }
}
