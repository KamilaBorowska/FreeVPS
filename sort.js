"use strict"
var lastColumn
_.each(document.getElementsByTagName('th'), function th(elem, i) {
    elem.onclick = function onclick() {
        var body = document.getElementsByTagName('tbody')[0]
        var rows = _.toArray(body.getElementsByTagName('tr'))
        var name = this.textContent.trim()

        if (lastColumn === name) {
            // The only reason why array is reversed is so that stable
            // sort could work correctly, so you could sort multiple
            // ways.
            rows.reverse()
        }

        rows = _.sortBy(rows, function sort(row) {
            var value = row.childNodes[i + 1].textContent.trim()
            switch (name) {
            // Numbers
            case 'Name':
            case 'Disk space':
            case 'Bandwidth':
            case 'RAM':
            case 'Burst (OpenVZ only)':
            case 'vSwap (OpenVZ only)':
            case 'IPv6 addresses':
                // Negative, so less is more
                var result = -(/\d+/.exec(value) || [0])[0]

                // If the value contains GB or TB, multiply it (it doesn't
                // apply to certain counts, like IPv6 addresses, but running
                // this code shouldn't hurt anything).
                if (value.indexOf("GB") !== -1)
                    result *= 1024
                else if (value.indexOf("TB") !== -1)
                    result *= 1024 * 1024

                return result

            // Booleans
            case 'SSD':
            case 'IPv6 addresses':
            case 'IRC clients':
            case 'IRC bouncers':
            case 'IRC bots':
            case 'IRC servers':
            case 'Minecraft':
            case 'Other game servers':
            case 'Java':
                return {
                    Yes: 1,
                    // LoomHosts
                    'By request': 2,
                    No: 3
                }[value]

            // United States at end
            case 'Location':
                return value.substring(0, 3) === 'US ' ? 'ZZZ' : value

            // Normal strings
            default:
                return value
            }
        })

        if (lastColumn === name) {
            // Actually reverse array.
            rows.reverse()
            lastColumn = undefined
        }
        else {
            lastColumn = name
        }

        _.each(rows, function rowPusher(row) {
            body.appendChild(row)
        })

        // Apply sorted class
        document.getElementsByClassName('sorted')[0].removeAttribute('class')
        this.setAttribute('class', 'sorted')
    }
})
