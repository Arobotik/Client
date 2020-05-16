import React from "react";

class Canvas extends React.Component {
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
        this.imageRef = React.createRef();
        this.state = {
            avatarPath : props.avatarPath,
            mouseIsDown : false,
            canvasW: 200,
            canvasH: 200,
        };
    }

    componentDidMount() {
        this.drawNew();
    }

    avatarX = 0;
    avatarY = 0;
    shiftX = 0;
    shiftY = 0;
    avatarW = 300;
    avatarH = 300;
    avatarDeltaW = 0;
    avatarDeltaH = 0;

    setNewImageSizeOnLoad(){
        let w = this.imageRef.current.width;
        let h = this.imageRef.current.height;
        this.avatarDeltaW = Math.floor(w / 10);
        this.avatarDeltaH = Math.floor(h / 10);
        if (w < h){
            this.avatarW = this.state.canvasW;
            let diff = w / this.state.canvasW;
            this.avatarH = h / diff;
        }
        else{
            this.avatarH = this.state.canvasH;
            let diff = h / this.state.canvasH;
            this.avatarW = w / diff;
        }
    }

    drawNew(){
        this.imageRef.current.onload = () => {
            this.setNewImageSizeOnLoad();
            this.canvasRef.current.getContext("2d").drawImage(this.imageRef.current, this.avatarX, this.avatarY, this.avatarW, this.avatarH);
        };
    }

    draw(){
        const ctx = this.canvasRef.current.getContext("2d");
        const img = this.imageRef.current;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0, this.avatarW, this.avatarH);
        ctx.drawImage(img, this.avatarX, this.avatarY, this.avatarW, this.avatarH);
        this.setState(this.state);
    }

    changeImage(newPath){
        this.setState({avatarPath: newPath});
        this.avatarX = 0;
        this.avatarY = 0;
        this.shiftX = 0;
        this.shiftY = 0;
        this.drawNew();
    }

    toBlob(type = 'image/png', quality=1){
        let binStr = atob( this.canvasRef.current.toDataURL(type, quality).split(',')[1] ),
            len = binStr.length,
            arr = new Uint8Array(len);
        for (let i = 0; i < len; i++ ) {
            arr[i] = binStr.charCodeAt(i);
        }
        return arr;
    }

    onAvatarMouseDown = e => {
        this.setState({mouseIsDown: true,});
        this.shiftX = e.pageX - this.canvasRef.current.offsetLeft - this.avatarX;
        this.shiftY = e.pageY - this.canvasRef.current.offsetTop - this.avatarY;
    };

    onAvatarMouseMove = e => {
        if (this.state.mouseIsDown){
            let newLeft = e.pageX - this.canvasRef.current.offsetLeft - this.shiftX;
            let newTop = e.pageY - this.canvasRef.current.offsetTop - this.shiftY;
            let newRight = newLeft + this.avatarW;
            let newBottom = newTop + this.avatarH;
            let allowX = newRight > this.state.canvasW && newLeft < 0;
            let allowY = newBottom > this.state.canvasH && newTop < 0;
            this.avatarX = allowX ? newLeft : this.avatarX;
            this.avatarY = allowY ? newTop : this.avatarY;
            this.draw();
        }
    };

    onAvatarMouseUp = e => {
        this.setState({mouseIsDown: false,});
    };

    onAvatarWheel = e => {
        if (e.deltaY < 0){
            if (this.avatarH < 1000 && this.avatarW < 1000){
                this.avatarW = this.avatarW + this.avatarDeltaW;
                this.avatarH = this.avatarH + this.avatarDeltaH;
            }
        }
        else{
            if (this.avatarH > this.state.canvasH && this.avatarW > this.state.canvasW){
                this.avatarW = this.avatarW - this.avatarDeltaW;
                this.avatarH = this.avatarH - this.avatarDeltaH;
            }
        }
        this.avatarX = 0;
        this.avatarY = 0;
        this.draw();
    };

    render() {
        return(
            <div>
                <canvas
                    onMouseDown={this.onAvatarMouseDown}
                    onMouseMove={this.onAvatarMouseMove}
                    onMouseUp={this.onAvatarMouseUp}
                    onDragStart={() => false}
                    onMouseLeave={this.onAvatarMouseUp}
                    onWheel={this.onAvatarWheel}
                    ref={this.canvasRef}
                    width={this.state.canvasW} height={this.state.canvasH}
                />
                <img ref={this.imageRef} src={this.state.avatarPath} style={{display: 'none'}} alt={'avatar'} />
            </div>
        )
    }
}
export default Canvas