require('normalize.css/normalize.css');
require('../styles/main.css')

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



class GalleryByReactApp extends React.Component {
  render() {
    return (
     	<section className="stage">
     		<section className="img-sec">舞台</section>
     		<nav className="controller-nav"></nav>
     	</section>
    );
  }
}

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
