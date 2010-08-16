/**
 * Ajex.FileManager
 * http://demphest.ru/ajex-filemanager
 *
 * @version
 * 0.8.1 (Sep 20 2009)
 * 
 * @copyright
 * Copyright (C) 2009 Demphest Gorphek
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 * 
 * Ajex.FileManager is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This file is part of Ajex.FileManager.
 */

var $cfg = {
	display:	{fileName: true, fileDate: false, fileSize: false},
	view:		{list: false, thumb: true},
	menu:	{file: {}, folder: {}},
	dir: '',
	lang:	'ru',
	type:	'file',
	sort: 'name',
	tmp: []
};
if ('' != (isType = parseUrl('type'))) { $cfg.type = isType; }
if ('' != (isLang = parseUrl('langCode'))) { $cfg.lang = isLang; }

var $ajaxConnector = 'ajax/php/ajax.php';
if ('' != (isConnector = parseUrl('connector'))) {
	switch(isConnector) {
		case '###':
			break;
		case 'php':
		default:
			//$ajaxConnector = 'ajax/php/ajax.php';
	}
}
$('head').prepend('<script type="text/javascript" src="lang/' + $cfg.lang + '.js"></script>');

var _cacheFiles = new Array();
var menuDiv	= {};
var statusDiv	= {};
var dialogDiv	= {};

$(document).ready(function() {
	
	$.post($ajaxConnector + '?mode=cfg', {
			type:	$cfg.type,
			lang: $cfg.lang
	},
	function(reply) {
		for (var i in reply.config) {
			$cfg[i] = reply.config[i];
		}
		
		$("#dirsList").dynatree({
			title: "upload",
			rootVisible: true,
			persist: true,
			clickFolderMode: 1,
			fx: {height: "toggle", duration: 200},
			children: $cfg.children,
			onActivate: function(dtnode) {
				$cfg.dir = encodeURIComponent(dtnode.data.key);
				viewsUpdate(dtnode.data.key);
				return;
			},
			onLazyRead: function(dtnode) {
				$.post($ajaxConnector + '?mode=getDirs', {
						dir:	dtnode.data.key,
						type:	$cfg.type,
						lang: $cfg.lang
					},
					function(reply) {
						dtnode.addChild(reply.dirs);
						dtnode.setLazyNodeStatus(DTNodeStatus_Ok);
						bindFolderContextMenu();
					}
				, 'json');

				return false;
			}
		});
		
		bindFolderContextMenu();

	}, 'json');


	$('.dirsMenu a', $('#dirs')).click(function() {
			if ('block' == $('#author').css('display')) {
				$('#author').hide();
			} else {
				$('#author').css({'left': '30%', 'top': '20%'}).show();
			}
			return false;
	});

	menuDiv	= $('#menu');
	statusDiv= $('#status');
	dialogDiv = $('#dialog');

	for (var i in $lang) {
		$('span[lang="' + i + '"]').text($lang[i]);
	}


	$('.view label[for="viewlist"], .view label[for="viewthumb"]', menuDiv).click(function() {
		if ($('#viewList').attr('checked')) {
			$('#fileThumb').hide();
			$('#fileList').show();
			$cfg.view.list = true;
			$cfg.view.thumb = false;
		} else {
			$('#fileList').hide();
			$('#fileThumb').show();
			$cfg.view.list = false;
			$cfg.view.thumb = true;
		}
		return;
	});
	
	$('.display label', menuDiv).click(function() {
		var attrId = $(this).attr('for');
		var attrDiv = attrId.substring(4).toLowerCase();

		if ($('#' + attrId).attr('checked')) {
			$('#fileThumb .' + attrDiv).show();
			$cfg.display[attrId] = true;
		} else {
			$('#fileThumb .' + attrDiv).hide();
			$cfg.display[attrId] = false;
		}
	});

	$('#checkAll').click(function() {
		if ($(this).attr('checked')) {
			$('#fileList tbody input[name="file\\[\\]"], #fileThumb input[name="file\\[\\]"]').attr('checked', 'checked');
		} else {
			$('#fileList tbody input[name="file\\[\\]"], #fileThumb input[name="file\\[\\]"]').removeAttr('checked');
		}
		return;
	});

	$('.sort label', menuDiv).click(function() {
		var attrId = $(this).attr('for');
		$cfg.sort = attrId.substring(4).toLowerCase();
		viewsUpdate($cfg.dir);
	});



	$cfg.menu.file = [
		{
			'<span lang="select">Select</span>' : {
				onclick : function(menuItem, menu) {
					_setReturnData($(this).attr('file'), '');
				},
				icon : 'img/ico/arrow_rotate_anticlockwise.png'
			}
		},
		{
			'<span lang="selectThumb">Select this thumbnail</span>' : {
				onclick : function(menuItem, menu) {
					_setReturnData($(this).attr('thumb'), '');
				},
				disabled : false,
				icon : 'img/ico/arrow_out.png'
			}
		},
		$.contextMenu.separator,
		{
			'<span lang="lookAt">Look</span>' : {
				onclick : function(menuItem, menu) {
					window.open($(this).attr('file'), 'preView', '');
				},
				icon : 'img/ico/eye.png'
			}
		},
		{
			'<span lang="renameFile">Rename file</span>' : {
				onclick : function(menuItem, menu) {
					if ($cfg.view.thumb) {
						var file = $('>.name', this).text();
					} else {
						var file = $('>a', this).text();
					}

					$cfg.tmp['mode'] = 'renameFile';
					$cfg.tmp['oldname'] = file;
					$cfg.tmp['key'] = '';

					dialogSet($lang.enterNewNameFile, '<b>' + file + '</b> [' + $cfg.url + $cfg.dir + '/]<br /><input type="text" id="newName" value="" class="t" /><br />' + $lang.allowRegSymbol);
					return;
				},
				icon : 'img/ico/application_xp_terminal.png'
			}
		},
		$.contextMenu.separator,
		{
			'<span lang="deleteFile">Delete file</span>' : {
				onclick : function(menuItem, menu) {
					if ($cfg.view.thumb) {
						var files = $('>.name', this).text();
					} else {
						var files = $('>a', this).text();
					}

					$.post($ajaxConnector + '?mode=deleteFiles', {
						dir : decodeURIComponent($cfg.dir),
						files : files,
						type: $cfg.type,
						lang: $cfg.lang
					}, function(reply) {
						appendFiles(reply);
					}, 'json');
	
					return;
				},
				icon : 'img/ico/cross.png'
			}
		},
		{
			'<span lang="deleteCheckedFile">Delete checked files</span>' : {
				onclick : function(menuItem, menu) {
					var files = [];
					$('#fileThumb input[name="file\\[\\]"]:checked').each(
							function() {
								files.push(this.value);
							});
					if (!files.length) {
						return;
					}
	
					$.post($ajaxConnector + '?mode=deleteFiles', {
						dir : decodeURIComponent($cfg.dir),
						files : files.join('::'),
						type: $cfg.type,
						lang: $cfg.lang
					}, function(reply) {
						appendFiles(reply);
					}, 'json');
	
					return;
				},
				icon : 'img/ico/delete.png'
			}
		}
	];

	$cfg.menu.folder = [
		{
			'<span lang="update">Update</span>' : {
				onclick : function(menuItem, menu) {
					var getPath = $('>span', $(this).parent()).attr('id');
					viewsUpdate(getPath.substring(15));
					return;
				},
				icon : 'img/ico/arrow_refresh.png'
			}
		},
		$.contextMenu.separator,
		{
			'<span lang="createFolder">Create folder</span>' : {
				onclick : function(menuItem, menu) {
					var path = $('>span', $(this).parent()).attr('id');
					path = path.substring(15);

					$cfg.tmp['mode'] = 'createFolder';
					$cfg.tmp['oldname'] = path;
					$cfg.tmp['key'] = path;

					dialogSet($lang.enterNameCreateFolder, '<b>' + $lang.location + '</b> [' + $cfg.url + path + '/]<br /><input type="text" id="newName" value="" class="t" /><br />' + $lang.allowRegSymbol);
					$(this.menu).hide();
					return;
				},
				icon : 'img/ico/folder_add.png'
			}
		},
		{
			'<span lang="renameFolder">Rename folder</span>' : {
				onclick : function(menuItem, menu) {
					var path = $('>span', $(this).parent()).attr('id');
					path = path.substring(15);
					var folders = path.split('%2F');
					if (1 == folders.length) return;

					var folder = folders[folders.length - 1];
					var key = path.substring(0, path.lastIndexOf('%2F'));

					$cfg.tmp['mode'] = 'renameFolder';
					$cfg.tmp['oldname'] = path;
					$cfg.tmp['key'] = key;

					dialogSet($lang.enterNewNameFolder, '<b>' + decodeURIComponent(folder) + '</b> [' + decodeURIComponent($cfg.url + key) + '/]<br /><input type="text" id="newName" value="" class="t" /><br />' + $lang.allowRegSymbol);
					return;
				},
				icon : 'img/ico/application_xp_terminal.png'
			}
		},
		{
			'<span lang="deleteFolder">Delete folder</span>' : {
				onclick : function(menuItem, menu) {
					$('#dirsList').dynatree('disable');
					
					var folder = $('>span', $(this).parent()).attr('id');
					folder = folder.substring(15);
					
					$.post($ajaxConnector + '?mode=deleteFolder', {
								dir : decodeURIComponent(folder),
								type: $cfg.type,
								lang: $cfg.lang
							},
							function(reply) {
								if (reply.isDelete) {
									$('#dirsList').dynatree('enable');
									var key = folder.substring(0, folder.lastIndexOf('%2F'));
									var tree = $('#dirsList').dynatree('getTree');
									var node = tree.getNodeByKey(key);
									node.reload(true);

									$('>div.l', statusDiv).html('<div class="warning"><b>' + $lang.successDeleteFolder + '</b></div>');
								} else {
									$('>div.l', statusDiv).html('<div class="warning"><b>' + $lang.failedDeleteFolder + '</b></div>');
								}
						}, 'json');

					return;
				},
				icon : 'img/ico/folder_delete.png'
			}
		},
		$.contextMenu.separator,
		{
			'<span lang="uploadSelectFiles">Upload selected files</span>' : {
				onclick : function(menuItem, menu) {
					if ('' == $('input:file').val()) {
						$('>div.l', statusDiv).html('<div class="successUpload"><b>' + $lang.chooseDownloads + '</b></div>');
						return;
					}

					var dir = $('>span', $(this).parent()).attr('id');
					$('#filesUploadForm').ajaxSubmit({
								url : $ajaxConnector + '?mode=uploads' ,
								type : 'post',
								beforeSubmit: function() {
									$('#filesUploadForm > input[name="dir"]').val(dir.substring(15));
									return true;
								},
								success : function showResponse(responseText, statusText) {
										$('>div.l', statusDiv).html('<div class="successUpload"><b>' + $lang.successUpload + '</b></div>');
										$('input:file').MultiFile('reset');
								}
						});
				},
				icon : 'img/ico/arrow_up.png'
			}
		}
	];

	$('.multi').MultiFile({
		max: 10,
		//accept: $cfg.allow,
		list: '#uploadList',
		STRING: {
			remove:		$lang.removeFile,
			selected:	$lang.selected,
			denied:		$lang.deniedExt,
			duplicate:	$lang.duplicate 
		}
	});


	$(dialogDiv).dialog({
		bgiframe: true,
		resizable: false,
		width: 400,
		height: 160,
		modal: true,
		autoOpen: false,
		overlay: {
			backgroundColor: '#000',
			opacity: 0.5
		},
		buttons: {
			'Cancel': function() {
				$(this).dialog('close');
			},
			' OK ': function() {
				var newname = $('#newName').val();
				if (!/^[a-z0-9-_#~\$%()\[\]&=]+/i.test(newname)) {
					return false;
				}
				$(this).dialog('close');
				$('#dialog input').attr('disabled', 'disabled');
				
				$.post($ajaxConnector + '?mode=' + $cfg.tmp['mode'], {
						dir: decodeURIComponent($cfg.dir),
						type:	$cfg.type,
						lang: $cfg.lang,
						oldname:	$cfg.tmp['oldname'],
						newname:	newname
					},
					function(reply) {
						if (reply.isSuccess && ('createFolder' == $cfg.tmp['mode'] || 'renameFolder' == $cfg.tmp['mode'])) {
							if ('exist' == reply.isSuccess) {
								$('>div.l', statusDiv).html('<div class="warning"><b>'+$lang.folderExist+'</b></div>');
								return;
							}
							var tree = $('#dirsList').dynatree('getTree');
							var node = tree.getNodeByKey($cfg.tmp['key']);
							node.reload(true);
						} else {
							appendFiles(reply);
						}
					}
				, 'json');

				return;
			}
		}
	});

	$('#author a').attr('target', '_blank');
});



function dialogSet(title, html)
{
	$('div.ui-dialog span.ui-dialog-title').html(title);
	$(dialogDiv).html(html);
	$(dialogDiv).dialog('open');
	$('#newName').focus();
	return;
}

function bindFolderContextMenu()
{
	return $('.ui-dynatree-document, .ui-dynatree-folder').not('#ui-dynatree-id-root').contextMenu($cfg.menu.folder, {
		theme: 'vista',
		beforeShow: function() {
			var a = $('a > i', this.target).remove();
			$cfg.dir = encodeURIComponent($('a', this.target).text());

			if ('' == $('input[name="uploadFiles\\[\\]"]').val()) {
				$(this.menu).find('.context-menu-item').eq(4).addClass('context-menu-item-disabled');
			} else {
				$(this.menu).find('.context-menu-item').eq(4).removeClass('context-menu-item-disabled');
			}

			for (var i in $lang) {$('span[lang="' + i + '"]', $(this.menu)).text($lang[i]);}/*		TODO: remake		*/
		}
	});
}

function bindFileContextMenu()
{
	return $('#fileThumb .thumb, #fileList .name').contextMenu($cfg.menu.file, {
		theme: 'vista',
		beforeShow: function() {
			if ('' == $(this.target).attr('thumb')) {
				$(this.menu).find('.context-menu-item').eq(1).toggleClass('context-menu-item-disabled');
			} else {
				$(this.menu).find('.context-menu-item').eq(1).removeClass('context-menu-item-disabled');
			}

			for (var i in $lang) {$('span[lang="' + i + '"]', $(this.menu)).text($lang[i]);}/*		TODO: remake		*/
		}
	});
}

function _setReturnData(input, data)
{
	window.top.opener['CKEDITOR'].tools.callFunction(parseUrl('CKEditorFuncNum'), input, data);
	window.top.close();
	window.top.opener.focus();
	return true;
}

function viewsUpdate(dir)
{
	if ('root' == dir)
		return;

	$.post($ajaxConnector + '?mode=getFiles', {
			dir:	decodeURIComponent(dir),
			type: $cfg.type,
			lang: $cfg.lang,
			sort: $cfg.sort
		},
		function(reply) {
			appendFiles(reply);
		}
	, 'json');

	return;
}

function appendFiles(reply)
{
	$('>div.l', statusDiv).html('<div>' + $cfg.url + reply.cfg.dir + '</div><div><b>' + reply.files.length + '</b> ' + $lang.fileOf + '</div>');

	var files = reply.files;
	var list = '', thumb = '', w_h = '', attr = '';

	for (var i in files) {
		attr = 'file="' + ($cfg.url + reply.cfg.dir + files[i].name) + '" thumb="' + (files[i].width? ($cfg.url + $cfg.thumb + '/' + reply.cfg.dir + files[i].name) : '') + '"';
		thumb += '<div class="thumb ext_' + files[i].ext + '" ' + attr + '><div class="image">';
		if (files[i].width) {
			w_h = '(' + files[i].width + ' x ' + files[i].height + ') '
			thumb += '<img src="' + files[i].thumb + '" alt="" />';
		} else {
			w_h = '';
			thumb += '<img src="img/.gif" alt="" />';
		}
		thumb += '</div><div class="check"><input type="checkbox" name="file[]" value="' + files[i].name + '" /></div>';
		thumb += '<div class="name" ' + ($cfg.display.fileName? 'style="display:block;"' : 'style="display:none"') + '>' + files[i].name + '</div>';
		thumb += '<div class="date" ' + ($cfg.display.fileDate? 'style="display:block;"' : 'style="display:none"') + '>' + files[i].date + '</div>';
		thumb += '<div class="size" ' + ($cfg.display.fileSize? 'style="display:block;"' : 'style="display:none"') + '>' + w_h + files[i].size + '</div>';
		thumb += '</div>';


		list += '<tr>';
		list += '<td><input type="checkbox" name="file[]" value="' + files[i].name + '" /></td>';
		list += '<td><div class="name"' + attr + '><a href="">' + files[i].name + '</a></div></td>';
		list += '<td><div class="date">' + files[i].date + '</div></td>';
		list += '<td><div class="size">' + w_h + files[i].size + '</div></td>';
		list += '</tr>';
	}

	$('#fileThumb').html(thumb);
	$('#fileList > table > tbody').html(list);
	$('#fileThumb > div.thumb').each(function() {

			var div = $(this);
			div.click(function() {

			var urlFile = $cfg.url + reply.cfg.dir + $('.name', div).text();
			$('>div.l', statusDiv).html('<div><a href="' + urlFile + '" target="_urlFile">' + urlFile + '</a></div><div>'+$lang.fileSize+': '+$('.size', div).text()+'</div><div>'+$lang.fileDate+': '+$('.date', div).text()+'</div>');
			div.css({'background-color': '#fff'});

		}).mouseover(function() {
			div.css({'color': '#000', 'background-color': '#cecece'});

		}).mouseout(function() {
			div.css({'color': '#fff', 'background-color': '#5a5a5a'});

		}).dblclick(function() {
			var urlFile = $cfg.url + reply.cfg.dir + $('.name', div).text();
			_setReturnData(urlFile, '');
		});

		$('#fileList .name a').dblclick(function () {
			var urlFile = $cfg.url + reply.cfg.dir + $(this).text();
			_setReturnData(urlFile, '');

			return false;
		}).click(function() {
			return false;
		});

	});


	$('#fileList input[name="file\\[\\]"]').click(function () {
		$(this).attr('checked')? $('#fileThumb input[value="' + $(this).attr('value') + '"]').attr('checked', 'checked') : $('#fileThumb input[value="' + $(this).attr('value') + '"]').removeAttr('checked');
	});
	$('#fileThumb input[name="file\\[\\]"]').click(function () {
		$(this).attr('checked')? 	$('#fileList input[value="' + $(this).attr('value') + '"]').attr('checked', 'checked') : $('#fileList input[value="' + $(this).attr('value') + '"]').removeAttr('checked');
	});

	bindFileContextMenu();
	return;
}







/*
 * -----
 * misc
 * 
 * */

function parseUrl(name)
{
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if (null == results) {
		return '';
	}
	return results[1];
}

var cssFix = function()
{
	var u = navigator.userAgent.toLowerCase(),
	is = function(t) {
		return (u.indexOf(t) != -1);
	};
	$("html").addClass([(!(/opera|webtv/i.test(u)) && /msie (\d)/.test(u)) ? ('ie ie' + RegExp.$1)
		: is('firefox/2') ? 'gecko ff2'	: is('firefox/3') ? 'gecko ff3'	: is('gecko/') ? 'gecko'
		: is('chrome/') ? 'chrome'
		: is('opera/9') ? 'opera opera9'	: /opera (\d)/.test(u) ? 'opera opera' + RegExp.$1
		: is('konqueror') ? 'konqueror'
		: is('applewebkit/') ? 'webkit safari'
		: is('mozilla/') ? 'gecko'
		: '',
		(is('x11') || is('linux')) ? ' linux' : is('mac') ? ' mac' : is('win') ? ' win'
	: ''].join(''));
}();

