<?php
/**
 * Hovercards
 *
 * Display a delightful preview of profiles when you hover on usernames.
 *
 * @package Hovercards
 * @author  Shade <shad3-@outlook.com>
 * @license MIT https://opensource.org/licenses/MIT
 * @version 1.3
 */

if (!defined('IN_MYBB')) {
    die('Direct initialization of this file is not allowed.<br /><br />Please make sure IN_MYBB is defined.');
}

if (!defined("PLUGINLIBRARY")) {
    define("PLUGINLIBRARY", MYBB_ROOT."inc/plugins/pluginlibrary.php");
}

$GLOBALS['hovercardsVersion'] = "1.3";

function hovercards_info()
{
    global $hovercardsVersion;

    hovercards_plugin_edit();

    if (hovercards_is_installed()) {

        global $PL, $mybb;

        $PL or require_once PLUGINLIBRARY;

        if (hovercards_apply_core_edits() !== true) {
            $apply = $PL->url_append('index.php',
                [
                    'module' => 'config-plugins',
                    'hovercards' => 'apply',
                    'my_post_key' => $mybb->post_code,
                ]
            );
            $description = "<br><br>Core edits missing. <a href='{$apply}'>Apply core edits.</a>";
        }
        else {
            $revert = $PL->url_append('index.php',
                [
                    'module' => 'config-plugins',
                    'hovercards' => 'revert',
                    'my_post_key' => $mybb->post_code,
                ]
            );
            $description = "<br><br>Core edits in place. <a href='{$revert}'>Revert core edits.</a>";
        }

    }

    return [
        'name'          =>  'Hovercards',
        'description'   =>  'Display a delightful preview of profiles when you hover on usernames.' . $description,
        'website'       =>  'https://www.mybboost.com/forum-hovercards',
        'author'        =>  'Shade',
        'version'       =>  $hovercardsVersion,
        'compatibility' =>  '18*',
    ];
}

function hovercards_is_installed()
{
    global $cache;

    $installed = $cache->read("shade_plugins");
    if ($installed['Hovercards']) {
        return true;
    }

}

function hovercards_install()
{
    global $mybb, $cache, $lang, $PL;

    $lang->load('hovercards');

    $PL or require_once PLUGINLIBRARY;

    // Add settings
    $PL->settings('hovercards', $lang->hovercards_settings_title, $lang->hovercards_settings_description, [
        'use_adaptive_colors' => [
            'title' => $lang->hovercards_settings_use_adaptive_colors,
            'description' => $lang->hovercards_settings_use_adaptive_colors_desc,
            'value' => 1
        ],
        'color_to_use' => [
            'title' => $lang->hovercards_settings_color_to_use,
            'description' => $lang->hovercards_settings_color_to_use_desc,
            'optionscode' => 'text',
            'value' => 'ffffff'
        ],
        'fields_to_use' => [
            'title' => $lang->hovercards_settings_fields_to_use,
            'description' => $lang->hovercards_settings_fields_to_use_desc,
            'optionscode' => 'text',
            'value' => 'username,regdate,lastactive,avatar'
        ],
        'drop_position' => [
            'title' => $lang->hovercards_settings_drop_position,
            'description' => $lang->hovercards_settings_drop_position_desc,
            'optionscode' => 'select
top left=Top left
top center=Top center
top right=Top right
middle left=Middle left
middle center=Middle center
middle right=Middle right
bottom left=Bottom left
bottom center=Bottom center
bottom right=Bottom right',
            'value' => 'bottom left'
        ]
    ]);

    // Add stylesheets
    $PL->stylesheet('hovercards.css', file_get_contents(dirname(__FILE__) . '/Hovercards/stylesheets/hovercards.css'));

    // Add templates
    $dir       = new DirectoryIterator(dirname(__FILE__) . '/Hovercards/templates');
    $templates = array();
    foreach ($dir as $file) {
        if (!$file->isDot() AND !$file->isDir() AND pathinfo($file->getFilename(), PATHINFO_EXTENSION) == 'html') {
            $templates[$file->getBasename('.html')] = file_get_contents($file->getPathName());
        }
    }
    $PL->templates('hovercards', 'Hovercards', $templates);

    hovercards_apply_core_edits(true);

    // Add the plugin to cache
    $info = hovercards_info();
    $shade_plugins = $cache->read('shade_plugins');
    $shade_plugins[$info['name']] = [
        'title' => $info['name'],
        'version' => $info['version']
    ];
    $cache->update('shade_plugins', $shade_plugins);
}

function hovercards_uninstall()
{
    global $cache, $PL;

    $PL or require_once PLUGINLIBRARY;

    $PL->settings_delete('hovercards');
    $PL->stylesheet_delete('hovercards');
    $PL->templates_delete('hovercards');

    hovercards_revert_core_edits(true);

    // Remove the plugin from cache
    $info = hovercards_info();
    $shade_plugins = $cache->read('shade_plugins');
    unset($shade_plugins[$info['name']]);
    $cache->update('shade_plugins', $shade_plugins);
}

function hovercards_plugin_edit()
{
    global $mybb;

    if ($mybb->input['my_post_key'] == $mybb->post_code) {

        if ($mybb->input['hovercards'] == 'apply') {
            if (hovercards_apply_core_edits(true) === true) {
                flash_message('Successfully applied core edits.', 'success');
                admin_redirect('index.php?module=config-plugins');
            }
            else {
                flash_message('There was an error applying core edits.', 'error');
                admin_redirect('index.php?module=config-plugins');
            }

        }

        if ($mybb->input['hovercards'] == 'revert') {

            if (hovercards_revert_core_edits(true) === true) {
                flash_message('Successfully reverted core edits.', 'success');
                admin_redirect('index.php?module=config-plugins');
            }
            else {
                flash_message('There was an error reverting core edits.', 'error');
                admin_redirect('index.php?module=config-plugins');
            }

        }

    }
}

function hovercards_apply_core_edits($apply = false)
{
    global $PL, $mybb;

    $PL or require_once PLUGINLIBRARY;

    $errors = [];

    $edits = [
        [
            'search' => 'return "<a href=\"{$mybb->settings[\'bburl\']}/".get_profile_link($uid)."\"{$target}{$onclick}>{$username}</a>";',
            'replace' => 'return "<a data-uid=\'{$uid}\' href=\"{$mybb->settings[\'bburl\']}/".get_profile_link($uid)."\"{$target}{$onclick}>{$username}</a>";'
        ]
    ];

    $result = $PL->edit_core('hovercards', 'inc/functions.php', $edits, $apply);

    if ($result !== true) {
        $errors[] = $result;
    }

    if (count($errors) >= 1) {
        return $errors;
    }
    else {
        return true;
    }
}

function hovercards_revert_core_edits($apply = false)
{
    global $PL;

    $PL or require_once PLUGINLIBRARY;

    return $PL->edit_core('hovercards', 'inc/functions.php', [], $apply);
}

if (defined("IN_ADMINCP")) {

    $plugins->add_hook("admin_config_settings_change", "hovercards_settings_saver");
    $plugins->add_hook("admin_formcontainer_output_row", "hovercards_settings_replacer");
    $plugins->add_hook("admin_load", "hovercards_ad");
    $plugins->add_hook("admin_page_output_footer", "hovercards_display_peekers");

}

// Advertising
function hovercards_ad()
{
    global $cache, $mybb;

    $info = hovercards_info();
    $plugins = $cache->read('shade_plugins');

    if (!in_array($mybb->user['uid'], (array) $plugins[$info['name']]['ad_shown'])) {

        flash_message('Thank you for downloading ' . $info['name'] . '! You might also be interested in other great plugins at <a href="https://www.mybboost.com">MyBBoost</a>.<br /><small>This message will not be shown again to you.</small>', 'success');

        $plugins[$info['name']]['ad_shown'][] = $mybb->user['uid'];
        $cache->update('shade_plugins', $plugins);

    }

}

$plugins->add_hook("global_start", "hovercards_preload_template");
function hovercards_preload_template()
{
    $GLOBALS['templatelist'] = implode(',',
      array_filter(
        array_merge(
          (array) explode(',', $GLOBALS['templatelist']),
          ['hovercards_template', 'hovercards_script']
        )
      )
    );
}

$plugins->add_hook("pre_output_page", "hovercards_load_template");
function hovercards_load_template(&$content)
{
    global $templates, $mybb, $lang, $hovercardsVersion;

    $lang->load('hovercards');

    eval("\$template = \"".$templates->get("hovercards_template")."\";");
    $template = json_encode($template);

    $opts = [];

    if (!$mybb->settings['hovercards_use_adaptive_colors'] and $mybb->settings['hovercards_color_to_use']) {
        $opts['backgroundColor'] = $mybb->settings['hovercards_color_to_use'];
    }

    if ($mybb->settings['hovercards_drop_position']) {
        $opts['dropPosition'] = $mybb->settings['hovercards_drop_position'];
    }

    $opts = json_encode($opts);

    eval("\$script = \"".$templates->get("hovercards_script")."\";");

    $html = <<<HTML

<script type="text/javascript" src="jscripts/tether.js"></script>
<script type="text/javascript" src="jscripts/drop.js"></script>
<script type="text/javascript" src="jscripts/hovercards.min.js?v={$hovercardsVersion}"></script>
{$script}

HTML;

    $content = str_replace('</head>', $html . '</head>', $content);

    return $content;

}

$plugins->add_hook("xmlhttp", "hovercards_xmlhttp");
function hovercards_xmlhttp()
{
    global $db, $mybb;

    if ($mybb->input['action'] == 'hovercards') {

        header('Content-Type: application/json');

        $uids = (is_array($mybb->input['uids'])) ? implode("','", array_map('intval', (array) $mybb->input['uids'])) : null;

        if ($uids and $mybb->settings['hovercards_fields_to_use']) {

            // Detect whether this admin included custom fields or not
            $custom_fields = (strpos($mybb->settings['hovercards_fields_to_use'], 'fid') !== false) ? true : false;

            // Adjust the query accordingly
            $extra_sql = ($custom_fields) ? ' u LEFT JOIN ' . TABLE_PREFIX . 'userfields f ON (f.ufid = u.uid)' : '';
            $prefix = ($custom_fields) ? 'u.' : '';

            $fields = (array) explode(',', $mybb->settings['hovercards_fields_to_use']);
            $fields[] = 'uid';

            if ($custom_fields) {

                // Add extra values, we need to build the username
                if (in_array('username', $fields)) {
                    $fields[] = 'usergroup';
                    $fields[] = 'displaygroup';
                }

            }

            // Add invisible option if lastactive is selected
            if (in_array('lastactive', $fields)) {
                $fields[] = 'invisible';
            }

            // Only unique values please
            $fields = array_values($fields);

            // Implode including the prefix
            $fields = (string) $prefix . implode(',' . $prefix, $fields);

            // In the end, replace the custom fids with the correct prefix
            if ($custom_fields) {
                $fields = str_replace('u.fid', 'f.fid', $fields);
            }

            if ($fields) {
                $query = $db->simple_select('users' . $extra_sql, $fields, $prefix . "uid IN ('{$uids}')");
            }

            if ($db->num_rows($query) > 0) {

                while ($user = $db->fetch_array($query)) {

                    if ($user['username']) {

                        $user['username'] = format_name($user['username'], $user['usergroup'], $user['displaygroup']);
                        $user['username'] = build_profile_link($user['username'], $user['uid']);

                        // We don't need these anymore
                        if (strpos($mybb->settings['hovercards_fields_to_use'], 'usergroup') === false) {
                            unset($user['usergroup']);
                        }

                        if (strpos($mybb->settings['hovercards_fields_to_use'], 'displaygroup') === false) {
                            unset($user['displaygroup']);
                        }

                    }

                    if ($user['invisible'] and $user['lastactive']) {
                        $user['lastactive'] = 'Hidden';
                    }

                    $users[] = $user;

                }

                echo json_encode($users, JSON_PRETTY_PRINT);

            }

        }

        exit;

    }
}

function hovercards_display_peekers()
{
    global $mybb;

    $gid = hovercards_settings_gid();

    if ($mybb->input['gid'] == $gid) {

        echo '<script type="text/javascript">
$(document).ready(() => {
    new Peeker($(".setting_hovercards_use_adaptive_colors"), $("#row_setting_hovercards_color_to_use"), /0/, true);
});
</script>';

    }
}

$GLOBALS['settingsToReplace'] = [
    "fields_to_use" => "fields",
];

// Fixes https://www.mybboost.com/thread-hover-cards-settings-clearing-problem
function hovercards_settings_gid()
{
    global $db;

    $query = $db->simple_select("settinggroups", "gid", "name = 'hovercards'", array(
        "limit" => 1
    ));
    $gid   = (int) $db->fetch_field($query, "gid");

    return $gid;
}

function hovercards_settings_saver()
{
    global $mybb, $page, $settingsToReplace;

    if ($mybb->request_method == "post"
        and $mybb->input['upsetting']
        and $page->active_action == "settings"
        and $mybb->input['gid'] == hovercards_settings_gid()
    ) {

        foreach($settingsToReplace as $setting => $option) {

            if (isset($mybb->input['upsetting']['hovercards_'.$setting]) and !is_array($mybb->input['hovercards_'.$setting.'_select'])) {
                $mybb->input['upsetting']['hovercards_'.$setting] = '';
            }
            else if (is_array($mybb->input['hovercards_'.$setting.'_select'])) {
                $mybb->input['upsetting']['hovercards_'.$setting] = implode(",", $mybb->input['hovercards_'.$setting.'_select']);
            }

        }

    }
}

function hovercards_settings_replacer($args)
{
    global $form, $lang, $mybb, $page, $settingsToReplace, $db;

    if ($page->active_action != "settings"
        and $mybb->input['action'] != "change"
        and $mybb->input['gid'] == hovercards_settings_gid()
    ) {
        return false;
    }

    $lang->load('hovercards');

    foreach($settingsToReplace as $setting => $option) {

        if ($args['row_options']['id'] == "row_setting_hovercards_".$setting) {

            preg_match("/value=\"[^ ]+\"/", $args['content'], $values);
            $values = explode(",", str_replace(["value", "\"", "="], "", $values[0]));

            // Get the _users/_userfields table fields list
            $fields = [];
            $disabled_fields = ['password', 'salt', 'loginkey', 'ufid'];

            $query = $db->query("
                SELECT *
                FROM information_schema.columns
                WHERE table_schema = DATABASE()
                AND table_name IN ('" . TABLE_PREFIX . "users','" . TABLE_PREFIX . "userfields')
            ");

            while ($row = $db->fetch_array($query)) {

                if (in_array($row['COLUMN_NAME'], $disabled_fields)) {
                    continue;
                }

                $fields[$row['COLUMN_NAME']] = $row['COLUMN_NAME'];

            }

            $args['content'] = $form->generate_select_box("hovercards_".$setting."_select[]", $fields, $values, ["multiple" => true, "size" => "10"]);

        }
    }
}
