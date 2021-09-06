const vscode = require('vscode');
const axios = require('axios');
/**
 * @param {vscode.ExtensionContext} context
 */

async function activate(context) {
	const URL='https://api.github.com/users/ShreyuABD06/repos';
	const res = await axios.get(URL);	
	const projects = res.data.map(project => {
		return {
		label: project.name,
		detail: project.full_name,	
		link: project.html_url,	
	}});

	console.log(projects);	
	let disposable = vscode.commands.registerCommand('my-github-repo.searchMyProjects', 
	async function () {		
		const project = await vscode.window.showQuickPick(projects,{
			matchOnDetail: true
		}
		)
		if(project==null)return;
			
		vscode.env.openExternal(project.link);
	});
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
