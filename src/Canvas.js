import React from "react";

class Canvas extends React.Component {
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
        this.imageRef = React.createRef();
        this.state = {avatarPath : props.avatarPath};
    }

    componentDidMount() {
        this.draw();
    }

    draw(){
        const ctx = this.canvasRef.current.getContext("2d");
        const img = this.imageRef.current;

        img.onload = () => {
            ctx.drawImage(img, 0, 0, 100,100);
        }
    }

    changeImage(newPath){
        this.setState({avatarPath: newPath});
        this.draw();
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

    render() {
        return(
            <div>
                <canvas ref={this.canvasRef} width={100} height={100} />
                <img ref={this.imageRef} src={this.state.avatarPath} style={{display: 'none'}} alt={'avatar'} />
            </div>
        )
    }
}
export default Canvas