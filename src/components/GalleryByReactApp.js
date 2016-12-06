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

//单个图片的组件，切记组件的名称要大写
class ImgFigure extends React.Component{
	render(){
		return(
			<figure className="img-figure">
				<img src={this.props.data.imageURL} 
					 alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
}


class GalleryByReactApp extends React.Component {
  render() {
	var controllerUnits=[],
		imgFigures=[];

	imageDatas.forEach(function (value) {
		imgFigures.push(<ImgFigure data={value} />);
	});


    return (
     	<section className="stage">
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
