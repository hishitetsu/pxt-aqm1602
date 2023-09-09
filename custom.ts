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
    export function printString(str: string, outputChar: OutputChar = OutputChar.Lowercase): void {
        for (let i = 0; i < str.length; i++) {
            let charCode = str.charCodeAt(i)
            if (outputChar == OutputChar.Katakana && charCode > 0x60 && charCode < 0xA0) {
                charCode += 0x40
            }
            printChar(charCode)
        }
    }

    /**
     * 文字列の表示位置を変更する
     * @param y 行のインデックス
     * @param x 列のインデックス
     */
    //% weight=80 block="表示位置 行%y 列%x"
    //% y.min=0 y.max=1 x.min=0 x.max=15
    export function changePosition(y: number, x: number): void {
        writeCommand(0x80 + y * 0x40 + x)
    }

    /**
     * 表示を消去する
     */
    //% weight=70 block="表示を消す"
    export function clear(): void {
        writeCommand(0x01)
    }

    /**
     * 指定された文字コードの文字を表示する
     * @param code 文字コード
     */
    //% weight=60 block="文字コード%codeの文字を表示"
    export function printChar(code: number): void {
        if (code >= 0x00 && code <= 0xFF) {
            writeCommand(0x4000 + code)
        }
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
