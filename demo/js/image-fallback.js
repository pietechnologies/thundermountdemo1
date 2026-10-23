/* Repair legacy cached demo image paths; preserve all stored demo data. */
(function () {
  'use strict';
  var sources = {
  "logo.jpg": "https://static.wixstatic.com/media/424d86_b9b306c6a9dc47539b15a600c0a59ba9~mv2.jpg/v1/crop/x_0,y_323,w_1536,h_379/fill/w_705,h_173,al_c,q_80/a_digital_vector_vector_logo_features_th.jpg",
  "logo-full.jpg": "https://static.wixstatic.com/media/424d86_b9b306c6a9dc47539b15a600c0a59ba9~mv2.jpg",
  "sommer-1.jpg": "https://static.wixstatic.com/media/424d86_dd648faf921945909e5f43911b5dec1e~mv2.jpg",
  "sommer-2.jpg": "https://static.wixstatic.com/media/424d86_136828a391a645ee897809715196672e~mv2.jpg",
  "6690l-1.png": "https://static.wixstatic.com/media/424d86_0d559b229f754f6b9130371c66330e0a~mv2.png",
  "6690l-2.png": "https://static.wixstatic.com/media/424d86_29eeadaa34c3483b9fc3dba4064c9576~mv2.png",
  "liftmaster-98032.jpg": "https://static.wixstatic.com/media/424d86_6f0119b3074f45a38235d84eb2e7e624~mv2.jpg",
  "marantec-380.jpg": "https://static.wixstatic.com/media/424d86_158bd39bcc63455d95c56b5306ee6e97~mv2.jpg",
  "genie-edge.jpg": "https://static.wixstatic.com/media/424d86_bfe8c267ee3e4773ad2f9403e72cb952~mv2.jpg",
  "alumadoors-1.jpg": "https://static.wixstatic.com/media/424d86_7214469123244d1fb250570cc48976b1~mv2.jpg",
  "alumadoors-2.jpg": "https://static.wixstatic.com/media/424d86_5210c941883b47a48f8426d43f7ee5cd~mv2.jpg",
  "wayne-dalton.jpg": "https://static.wixstatic.com/media/424d86_6c95a7ed84aa4aee9e79e974cfe43b71~mv2.jpg",
  "tmmrt-24-1.jpg": "https://static.wixstatic.com/media/424d86_63007af6d4d74b33888cee384f3ba24c~mv2.jpg",
  "tmgt-2.jpg": "https://static.wixstatic.com/media/424d86_f452ae18e27842b6ac4a6864c09bb7fdf002.jpg",
  "tmgt-3.jpg": "https://static.wixstatic.com/media/424d86_3e984c2f7e47496380359795b1abbd96~mv2.jpg",
  "tmgt-19.jpg": "https://static.wixstatic.com/media/424d86_3e984c2f7e47496380359795b1abbd96~mv2.jpg",
  "tmgt-29.jpg": "https://static.wixstatic.com/media/424d86_f9b34a9280da426a925d7658e9e51b65~mv2.jpeg",
  "set.jpg": "https://static.wixstatic.com/media/424d86_dcb08f843594428ab475269b6036a396~mv2.jpg"
};
  document.addEventListener('error', function (event) {
    var image = event.target;
    if (!image || image.tagName !== 'IMG') return;
    var src = image.getAttribute('src') || '';
    if (!/(^|\/)assets\/img\//.test(src)) return;
    var replacement = sources[src.split('/').pop()];
    if (replacement) image.src = replacement;
  }, true);
}());
