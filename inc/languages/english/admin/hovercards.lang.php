<?php

// --- Settings ---
$l['hovercards'] = 'Hovercards';
	
$l['hovercards_settings_title'] = 'Hovercards settings';
$l['hovercards_settings_description'] = 'This section allows you to tune the displaying options for Hovercards.';

$l['hovercards_settings_use_adaptive_colors'] = 'Use adaptive colors';
$l['hovercards_settings_use_adaptive_colors_desc'] = 'Enable this option to let Hovercards fetch the user\'s avatar dominant color and use it as the background of his card. Text will be adapted automatically (white for darker backgrounds, black for brighter ones). <b>This feature uses Google\'s image cache to get raw external images, because most hosts block third-party sites requests</b>. It means that Hovercards may looks a bit slower, depending if Google\'s server hangs up or not.';

$l['hovercards_settings_color_to_use'] = 'Manual background color';
$l['hovercards_settings_color_to_use_desc'] = 'Choose a valid HEX color to use for all cards background. Do not add the "#" prefix. <b>RGBA format is not supported at the moment</b>.';

$l['hovercards_settings_fields_to_use'] = 'Fields to use';
$l['hovercards_settings_fields_to_use_desc'] = 'Select what data you would like to show in a single hovercard. You can reference to a specific data point named FIELD with the following simple syntax: <b>{FIELD}</b>. This syntax is available only in Hovercards templates. Fields are gathered from your board\'s _users and _userfields tables.';

$l['hovercards_settings_drop_position'] = 'Card positioning';
$l['hovercards_settings_drop_position_desc'] = 'Select where should be attached the card relative to its attached element.';