!function(a){
	if(typeof module != "undefined" && module.exports) {
		module.exports = a(data => Buffer.from(data, "base64").toString(), data => Buffer.from(data).toString("base64"));
	} else {
		Object.assign(window, a(atob, btoa));
	}
}(function(atob, btoa){

	class Writer {

		constructor() {
			this.buffer = [];
		}

		write(value) {
			this.buffer.push(value & 255);
		}

		writeInt(value) {
			this.write(value);
			this.write(value >> 8);
			this.write(value >> 16);
			this.write(value >> 24);
		}

		writeString(value) {
			value = Array.prototype.slice.call(new TextEncoder("utf-8").encode(value), 0);
			this.writeInt(value.length);
			this.buffer.push(...value);
		}

		toString() {
			return String.fromCharCode.apply(null, this.buffer);
		}

	}

	class Reader {

		constructor(data) {
			this.index = 0;
			this.buffer = new Uint8Array(data.length);
			for(let i=0; i<data.length; i++) {
				this.buffer[i] = data.charCodeAt(i);
			}
		}

		read() {
			return this.buffer[this.index++];
		}

		readInt() {
			return this.read() | this.read() << 8 | this.read() << 16 | this.read() << 24;
		}

		readString() {
			const length = this.readInt();
			return new TextDecoder().decode(this.buffer.slice(this.index, this.index += length));
		}

	}

	return {

		encode(data) {
			const writer = new Writer();
			writer.writeInt(Object.keys(data).length);
			for(let key in data) {
				writer.writeString(key);
				writer.writeString(data[key]);
			}
			return btoa(writer.toString());
		},

		decode(data) {
			const ret = {};
			const reader = new Reader(atob(data));
			let length = reader.readInt();
			while(length-- > 0) {
				ret[reader.readString()] = reader.readString();
			}
			return ret;
		}

	}

});
