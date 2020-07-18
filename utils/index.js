const utils = {}

utils.getCurPrj = function (curFilePath, rootPath, projects = []){
  let curPrjName;
  let curPrjPath;

  if (projects.length) {
      // 多项目
      projects.some(prj => {
          let prjPath = path.join(rootPath, prj);
          if (curFilePath.indexOf(prjPath) === 0) {
              curPrjName = prj
              curPrjPath = prjPath
              return true
          }
      })
  } else {
      // 单项目
      curPrjPath = rootPath
      curPrjName = '/'
  }

  return {
    curPrjPath,
    curPrjName
  }
}

utils.getPath = function (){
  //
}

module.exports = utils;