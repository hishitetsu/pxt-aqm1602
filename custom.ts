enum OutputChar {
    //% block="英小文字"
    Lowercase,
    //% block="半角カナ"
    Katakana
}

/**
 * AQM1602制御用ブロック
 */
//% icon="\uF26C" block="AQM1602"
namespace aqm1602 {
    /**
      * LCDを初期化する
      * @param contrast コントラスト
      */
    //% weight=100 block="LCDを初期化 || コントラスト%contrast"
    //% contrast.min=0 contrast.max=15 contrast.defl=3
    export function initialize(contrast: number = 3): void {
        writeCommand(0x38)
        writeCommand(0x39)
        writeCommand(0x14)
        writeCommand(0x70 + contrast)
        writeCommand(0x56)
        writeCommand(0x6C)
        writeCommand(0x38)
        writeCommand(0x01)
        writeCommand(0x0C)
    }

    /**
     * 文字列を表示する
     * @param str 文字列
     */
    //% weight=90 block="文字列を表示%str || 出力文字%outputChar"
    //% str.defl="Hello!"
    export function print(str: string, outputChar: OutputChar = OutputChar.Lowercase): void {
        for (let i = 0; i < str.length; i++) {
            let charCode = str.charCodeAt(i)
            if (outputChar == OutputChar.Katakana && charCode > 0x60 && charCode < 0xA0) {
                charCode += 0x40
            }
            writeData(charCode)
        }
    }

    /**
     * 文字列の表示位置を変更する
     * @param x 列のインデックス
     * @param y 行のインデックス
     */
    //% weight=80 block="表示位置 行%y 列%x"
    //% x.min=0 x.max=15 y.min=0 y.max=1
    export function changePosition(x: number, y: number): void {
        writeCommand(0x80 + (y * 0x40 + x))
    }

    /**
     * 表示を消去する
     */
    //% weight=70 block="表示を消す"
    export function clear(): void {
        writeCommand(0x01)
    }

    function writeData(data: number): void {
        pins.i2cWriteNumber(
            0x3E,
            0x4000 + data,
            NumberFormat.UInt16BE,
            false
        )
    }

    function writeCommand(command: number): void {
        pins.i2cWriteNumber(
            0x3E,
            command,
            NumberFormat.UInt16BE,
            false
        )
        if (command < 0x04) {
            basic.pause(1)
        }
    }
}
