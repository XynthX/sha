const sha256 = {
    sc: function(str, hex) {
        function bintohex(binarray) {
            var hexTab = "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hexTab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 + 4 & 15) + hexTab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 & 15);
            }
            return str;
        }

        function rightRotate(value, amount) {
            return value >>> amount | value << 32 - amount;
        }
        const K = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
        const initialHashValues = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
        let messageBytes = [];
        for (let i = 0; i < str.length; i++) {
            messageBytes.push(str.charCodeAt(i) & 255);
        }
        const originalLength = messageBytes.length * 8;
        messageBytes.push(128);
        while (messageBytes.length * 8 % 512 !== 448) {
            messageBytes.push(0);
        }
        const lengthBits = originalLength.toString(2).padStart(64, "0");
        for (let i = 0; i < 64; i += 8) {
            const byte = parseInt(lengthBits.substr(i, 8), 2);
            messageBytes.push(byte);
        }
        const chunks = [];
        for (let i = 0; i < messageBytes.length; i += 64) {
            chunks.push(messageBytes.slice(i, i + 64));
        }
        let hash = initialHashValues.slice();
        for (let chunk of chunks) {
            const words = [];
            for (let i = 0; i < 16; i++) {
                const word = chunk[i * 4] << 24 | chunk[i * 4 + 1] << 16 | chunk[i * 4 + 2] << 8 | chunk[i * 4 + 3];
                words.push(word);
            }
            for (let i = 16; i < 64; i++) {
                const s0 = rightRotate(words[i - 15], 7) ^ rightRotate(words[i - 15], 18) ^ words[i - 15] >>> 3;
                const s1 = rightRotate(words[i - 2], 17) ^ rightRotate(words[i - 2], 19) ^ words[i - 2] >>> 10;
                words[i] = words[i - 16] + s0 + words[i - 7] + s1;
            }
            let [a, b, c, d, e, f, g, h] = hash;
            for (let i = 0; i < 64; i++) {
                const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
                const ch = e & f ^ ~e & g;
                const temp1 = h + S1 + ch + K[i] + words[i];
                const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
                const maj = a & b ^ a & c ^ b & c;
                const temp2 = S0 + maj;
                h = g;
                g = f;
                f = e;
                e = d + temp1;
                d = c;
                c = b;
                b = a;
                a = temp1 + temp2;
            }
            hash[0] += a;
            hash[1] += b;
            hash[2] += c;
            hash[3] += d;
            hash[4] += e;
            hash[5] += f;
            hash[6] += g;
            hash[7] += h;
            for (let i = 0; i < 8; i++) {
                hash[i] = hash[i] >>> 0;
            }
        }
        if (hex) {
            return bintohex(hash);
        } else {
            return hash;
        }
    },
    raw: function(str) {
        return this.sc(str, false);
    },
    hex: function(str) {
        return this.sc(str, true);
    }
};
