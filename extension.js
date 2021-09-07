const vscode = require('vscode');
const axios = require('axios');
/**
 * @param {vscode.ExtensionContext} context
 */

async function activate(context) {	
	let disposable = vscode.commands.registerCommand('my-github-repo.searchMyProjects', 
	async function () {	
		const user = await vscode.window.showInputBox({
			placeHolder:'search user',
			prompt: 'User Name?'
		})	
		console.log(user);
		if (user==null || user==='' || user===undefined) {
			await vscode.window.showInformationMessage('Please select valid user!');
			return;
		}
		const URL=`https://api.github.com/users/${user}/repos`;
		const res = await axios.get(URL);	
		const projects = res.data.map(project => {
		return {
		label: project.name,
		detail: project.full_name,	
		link: project.html_url,	
		}});
		console.log(projects.length);
		if(projects==null || projects.length<1 || projects===undefined){
			await vscode.window.showInformationMessage('User has 0 repositories or user doesnt exist. Please search for different user!');
			return;
		}
		const project = await vscode.window.showQuickPick(projects,{
			matchOnDetail: true
		}
		)
		if(project==null){
			return;
		}			
		vscode.env.openExternal(project.link);
	});
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
