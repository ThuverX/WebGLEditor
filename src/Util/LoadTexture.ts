import Context from "../Context"

const { gl } = Context.documentInstance

export function LoadTexture(path: string): WebGLTexture {
	const texture: WebGLTexture | null = gl.createTexture()

	gl.bindTexture(gl.TEXTURE_2D, texture)

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
		1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
		new Uint8Array([0, 0, 255, 255]))

	const image: HTMLImageElement = new Image()
	image.onload = function () {
		gl.bindTexture(gl.TEXTURE_2D, texture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
			gl.RGBA, gl.UNSIGNED_BYTE, image)

		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
			gl.generateMipmap(gl.TEXTURE_2D)
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		}
	}
	image.src = path

	return texture!
}

function isPowerOf2(value: number) {
	return (value & (value - 1)) == 0
}