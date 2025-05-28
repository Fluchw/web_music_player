
颜色
```html
setCommonUniforms() {
    if (this.commonUniforms = {}, this.commonUniforms.uInnerColor = {
            value: new de("#ff8080")
        }, this.commonUniforms.uOuterColor = {
            value: new de("#3633ff")
        }, this.debug.active) {
        const e = this.debug.ui.getFolder("blackhole");
        e.addColor(this.commonUniforms.uInnerColor, "value"), e.addColor(this.commonUniforms.uOuterColor, "value")
    }
}
```