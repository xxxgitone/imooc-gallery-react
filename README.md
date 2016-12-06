#慕课网实例，使用React制作一个图片画廊

###开发环境
*	使用`yeoman`脚手架工具

		npm install yo -g

		yo --version   //查看版本号

*	安装`generator-react-webpack`

		npm install generator-react-webpack -g

*	在github上新建一个仓库，克隆到自己的工作空间，然后进入到项目目录
*	
		cd imooc-gallery-react

*	创建项目	

		yo react-webpack gallery-by-react

*	启动服务

		npm start
*	安装`sass`依赖(查看`package.json`可以查看依赖，没有则需要安装)

		npm install sass-loader node-sass webpack --save-dev

*	安装自动添加浏览器商前缀
	
		npm install autoprefixer-loader --save-dev

	*	然后`cfg/defaults.js`的`loaders:`

			{
		        test: /\.css$/,
		        loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 2 version", "firefox 15"]}'
		      },
			{
		        test: /\.scss/,
		        loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 2 version", "firefox 15"]}!sass-loader?outputStyle=expanded'
		      },

