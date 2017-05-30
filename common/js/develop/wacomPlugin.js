function getWacomPlugin() {
    return window.Wacom || document.embeds["wacom-plugin"];
}

function getPressure() {
    if (!m_is_wacom) return 0;
    return getWacomPlugin().pressure;
}

function initWacom() {
    var isWacom = getWacomPlugin().isWacom;
    if (isWacom == undefined) {
        m_is_wacom = false;
    } else if (isWacom == 0) {
        m_is_wacom = false;
    } else {
        m_is_wacom = true;
    }
	console.log(m_is_wacom);
}