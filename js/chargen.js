var character;
let renderer = Renderer.get();

function init(file, callback) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file, true);
	rawFile.onreadystatechange = function() {
		if (rawFile.readyState === 4 && rawFile.status == "200") {
			callback(rawFile.responseText);
		}
	}
	rawFile.send(null);
}

init("data/characters/character-template.json", function(text) {
	character = JSON.parse(text);
	resetAbilityScores();
	renderCharacter();
	preview("races")
});

function renderCharacter() {
	renderer.setFirstSection(true);
	renderer.resetHeaderIndex();

	const renderStack = [];
	renderer.recursiveRender(character, renderStack);
	var renderText = renderStack.join("");

	$("#content").html(`
		<tr><th class="border" colspan="6"></th></tr>
		<tr class="text"><td colspan="6">` + renderText + `</td></tr>
		<tr><th class="border" colspan="6"></th></tr>
	`);
}

function resetAbilityScores() {
	var abilities = ["str","dex","con","int","wis","cha"];
	for (var i = 0; i < abilities.length; i++) {
		$("#" + abilities[i] + "Input").val(8);
	}
	$("#nameInput").val("");
}

function updateAbilityScore(ability) {
	character.data[ability] = parseInt($("#" + ability + "Input").val());
	renderCharacter();
}

function updateName() {
	character.data.name = $("#nameInput").val();
	renderCharacter();
}

function preview(page) {
	console.log("Getting " + page + "...");
	$("#contentPreview").html("<iframe id='contentPreviewWindow' src='/" + page + ".html' style='width:100%; nav{display:none}' height='500'></iframe><button onclick=\"addSelection('" + page + "')\">Choose</button>");

	$("#contentPreviewWindow").ready(function() {
		$("#contentPreviewWindow").contents().find("nav").remove();
	})

}

function addSelection(field) {
	console.log($("#contentPreviewWindow").contents().find("th[data-page]").first());
}

