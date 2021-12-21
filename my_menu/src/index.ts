import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

/**
 * Initialization data for the my_menu extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'my_menu:plugin',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension my_menu is activated!');


    var enableSayHello = true;
    
    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('my_menu settings loaded:', settings.composite);
          enableSayHello = settings.get('enableSayHello').composite as boolean;
        })
        .catch(reason => {
          console.error('Failed to load settings for my_menu.', reason);
        });
    }
    
    const COMMAND_ID1 = 'my_menu:say-hello';
    app.commands.addCommand(COMMAND_ID1, {
        label: '說 hello',
        isEnabled: () => { return enableSayHello; },
        isVisible: () => { return true; },
        execute: () => { alert('Hello!'); },
    });
    
    const COMMAND_ID2 = 'my_menu:enable-say-hello';
    app.commands.addCommand(COMMAND_ID2, {
        label: '啟用 [說 hello]',
        isToggled: () => { 
            console.log("[my_menu] enableSayHello:", enableSayHello);
            return enableSayHello;
        },
        execute: () => {
            if (settingRegistry) {
                Promise.all([app.restored, settingRegistry.load(plugin.id)])
                .then(([_, settings]) => {
                    enableSayHello = !enableSayHello;
                    settings.set('enableSayHello', enableSayHello);
                    console.log("[my_menu] update 'enableSayHello' to", enableSayHello);
                })
            }
        },
    });
  }
};

export default plugin;
