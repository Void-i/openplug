$('#volume').bind('mousewheel', function(_){
	_.deltaY > 0 ? API.setVolume(API.getVolume() + 6) : API.setVolume(API.getVolume() - 6)
});
