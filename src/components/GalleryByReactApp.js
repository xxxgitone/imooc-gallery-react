require('normalize.css/normalize.css');
require('../styles/main.scss')

import React from 'react';

//获取图片数据
var imageDatas=require('../data/imagesDatas.json');

//将图片的fileName转换成真实的图片路径
imageDatas=(function genImageURL(imageDatasArr) {
	for (var i = 0; i < imageDatasArr.length; i++) {
		var singleImageData=imageDatasArr[i];

		singleImageData.imageURL=require('../images/'+singleImageData.fileName);

		imageDatasArr[i]=singleImageData;
	}

	return imageDatasArr;
})(imageDatas);

/*
获取区间内的一个随机值
 */
function getRangeRandom(low,high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

/*
获取0~30度之间任意的正负值
 */
function get30DegRandom() {
	return ((Math.random()>0.5 ? '' : '-') + Math.floor(Math.random() * 30));
}



//单个图片的组件，切记组件的名称要大写
class ImgFigure extends React.Component{
	constructor(props){
		super(props);
		this.handleClick=this.handleClick.bind(this);
	}
	//点击处理函数
	handleClick(e){
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		

		e.stopPropagation();
		e.preventDefault();
	}
	render(){
		var styleObj={};

		//如果props属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj=this.props.arrange.pos;
		}

		//如果图片旋转角度有值，并且不为0,添加旋转角度
		if(this.props.arrange.rotate){
			(['-webkit-','-moz-','-ms-','']).forEach(function (value) {
				styleObj[value+'transform']='rotate('+this.props.arrange.rotate+'deg)';

			}.bind(this))
		}
		
		if (this.props.arrange.isCenter) {
			styleObj.zIndex=11;
		}

		var imgFigureClassName="img-figure";
			imgFigureClassName+=this.props.arrange.isInverse ? ' is-inverse' : '';


		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} 
					 alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}
}
// 控制组件
class ControllerUnit extends React.Component{
	constructor(){
		super();
		this.handleClick=this.handleClick.bind(this);
	}

	handleClick(e){
		e.stopPropagation();
		e.preventDefault();
	}

	render() {
		return (
			<span className="controller-unit" onClick={this.handleClick}></span>
		);
	}
}


//图片组件
class GalleryByReactApp extends React.Component {
	
	constructor(props){
		super(props);
		//每一张图片的状态
		this.state={
			imgsArrangeArr:[
				// {
				// 	pos:{
				// 		left:'0',
				// 		top:'0'
				// 	},
				// 	rotate:0,		//旋转角度
				// 	isInverse:false, //图片正反面
				// 	isCenter:false  //是否居中
				// }
			]
		};

		this.Constant={
			centerPos:{//中心位置
				left:0,
				top:0
			},
			hPosRange:{//水平方向上的取值范围
				leftSecX:[0,0],//左分区x
				rightSecX:[0,0],//右分区x
				y:[0,0]
			},
			vPosRange:{//垂直方向上的取值范围
				x:[0,0],
				topY:[0,0]
			}
		};
	}
	
	/**
	 * 翻转图片
	 * @param  {number} index 输入当前被执行inverse操作的图片对应的信息数组的index值
	 * @return {function}   这是一个闭包函数，其内return一个真正待执行的函数
	 */
	 inverse(index) {
	    return ()=>{
	      var imgsArrangeArr = this.state.imgsArrangeArr;

	      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

	      this.setState({
	        imgsArrangeArr: imgsArrangeArr
	      });
	    };
  	}

	/**
	 * 重新排布所有图片
	 * @param centerIndex 指定居中排布哪张图片
	 */
	rearrange(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
		       Constant = this.Constant,
		       centerPos = Constant.centerPos,
		       hPosRange = Constant.hPosRange,
		       vPosRange = Constant.vPosRange,
		       hPosRangeLeftSecX = hPosRange.leftSecX,
		       hPosRangeRightSecX = hPosRange.rightSecX,
		       hPosRangeY = hPosRange.y,
		       vPosRangeTopY = vPosRange.topY,
		       vPosRangeX = vPosRange.x,
			
		imgsArrangTopArr=[],
		topImgNum=Math.floor(Math.random() * 2),//取一张或者不取图片放在上侧
		topImgSpliceIndex=0,    //索引

		//从某个位置开始提取一个，这里就是提取centerIndex,原数组不会再有这个剔除的状态
		imgsArrangCenterArr=imgsArrangeArr.splice(centerIndex,1);
		

		// 首先居中centerIndex的图片,居中的图片不需要旋转
		imgsArrangCenterArr[0]={
			pos:centerPos,
			rotate:0,
			isCenter:true
		}

		//取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangTopArr=imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		//布局位于上侧的图片
		imgsArrangTopArr.forEach(function(value,index){
			imgsArrangTopArr[index]={
				pos:{
					top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
					left:getRangeRandom(vPosRangeX[0],vPosRangeX[1]),
				},
				rotate:get30DegRandom(),
				isCenter:false
			}
		});
		
		//布局左右两侧的图片
		for(var i=0, j=imgsArrangeArr.length,k = j / 2;i < j; i++){
			var hPosRangeLORX=null;

			if (i < k) {
				hPosRangeLORX=hPosRangeLeftSecX;
			}else{
				hPosRangeLORX=hPosRangeRightSecX;
			}

			imgsArrangeArr[i]={
				pos:{
					top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
					left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
				},
				rotate:get30DegRandom(),
				isCenter:false,
			}


		}
		
		//将取出来的塞回去
		if (imgsArrangTopArr&&imgsArrangTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangTopArr[0]);
		}
		imgsArrangeArr.splice(centerIndex,0,imgsArrangCenterArr[0]);
		

		//会重新渲染
		this.setState({
			imgsArrangeArr:imgsArrangeArr
		});

	};
	
	/**
	 * 利用rearrange函数，居中对应的index图片
	 * @param  {number} index 需要被居中的图片对应的图片信息数组的index值
	 * @return {function}   
	 */
	center(index){
		return ()=>{
			this.rearrange(index);
		}
	}
	
	//组件加载完成后，为每张图片计算其位置范围
	componentDidMount(){
		//首先拿到舞台的大小
		var stageDOM=this.refs.stage,
			stageW=stageDOM.scrollWidth,
			stageH=stageDOM.scrollHeight,
			halfStageW=Math.ceil(stageW/2),
			halfStageH=Math.ceil(stageH/2);

		//拿到一个imgFigure的大小，因为都一样，所以取一个就好
		var imgFigureDOM=document.getElementsByClassName('img-figure')[0];
		//this.refs.imgFigure0; 使用ref可以获取到imgFigure0，但是不能获取到宽度，不知道什么原因，
		//弄了好久，真是奇怪
		var	imgW=imgFigureDOM.scrollWidth,
			imgH=imgFigureDOM.scrollHeight,
			halfImgW=Math.ceil(imgW/2),
			halfImgH=Math.ceil(imgH/2);
		//console.log(.scrollWidth);
		// 计算中心图片的位置
		this.Constant.centerPos={
			left:halfStageW-halfImgW,
			top:halfStageH-halfImgH
		};
		
		//计算左侧和右侧图片排布位置的取值范围
		this.Constant.hPosRange.leftSecX[0]=-halfImgW;
		this.Constant.hPosRange.leftSecX[1]=halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0]=halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1]=stageW - halfImgW;
		this.Constant.hPosRange.y[0]=-halfImgH;
		this.Constant.hPosRange.y[1]=stageH - halfImgH;
	
		// 计算上侧区域图片排布位置的取值范围
		this.Constant.vPosRange.topY[0]=-halfImgH;
		this.Constant.vPosRange.topY[1]=halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0]=halfStageW - imgW;
		this.Constant.vPosRange.x[1]=halfStageW;

		this.rearrange(0);

	}

	render() {
		var controllerUnits=[],
			imgFigures=[];

		imageDatas.forEach(function (value,index) {
			//初始化位置
			if (!this.state.imgsArrangeArr[index]) {
            	this.state.imgsArrangeArr[index] = {
	                pos: {
	                    left: 0,
	                    top: 0
	                },
	                rotate:0,
	                isInverse:false,
	                isCenter:false
            	};
        	}
			
			imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} 
								arrange={this.state.imgsArrangeArr[index]} 
								inverse={this.inverse(index)}
								center={this.center(index)}/>);
			controllerUnits.push(<ControllerUnit/>);
		}.bind(this));

	    return (
	     	<section className="stage" ref="stage">
	     		<section className="img-sec">
					{imgFigures}
	     		</section>
	     		<nav className="controller-nav">
					{controllerUnits}
	     		</nav>
	     	</section>
	    );
  	}
}

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
