import { Action, ActionPanel, getPreferenceValues, Grid } from '@raycast/api';
import { useState } from 'react';
import colors from 'tailwindcss/colors';

// filter & format colors
const colorShades = Object.keys(colors).flatMap((color) =>
	Object.getOwnPropertyDescriptor(colors, color)?.writable && typeof colors[color as keyof typeof colors] !== 'string'
		? [{ color, shades: Object.entries(colors[color as keyof typeof colors]).map(([shade, hex]) => ({ shade, hex })) }]
		: []
);

// get preferences
interface Preferences {
	primaryAction: 'copy' | 'paste';
	primaryValue: 'color' | 'hex';
}
const preferences = getPreferenceValues<Preferences>();

// create ui component
const SearchColors = () => {
	// set size
	const [size, setSize] = useState<Grid.ItemSize | 'fit'>(Grid.ItemSize.Small);
	// create default action panel
	const defaultActionPanel = (
		<ActionPanel>
			<ActionPanel.Section>
				<Action.OpenInBrowser
					title="Tailwind CSS Colors Documentation"
					url="https://tailwindcss.com/docs/customizing-colors"
				/>
			</ActionPanel.Section>
		</ActionPanel>
	);
	// create search bar dropdown
	const searchBarDropdown = (
		<Grid.Dropdown tooltip="View Options" onChange={(value) => setSize(value as Grid.ItemSize)} storeValue>
			<Grid.Dropdown.Section>
				<Grid.Dropdown.Item title="Small : 100-800" value={Grid.ItemSize.Small} />
				<Grid.Dropdown.Item title="Medium : 50-900" value={Grid.ItemSize.Medium} />
				<Grid.Dropdown.Item title="Large : 100-900" value={Grid.ItemSize.Large} />
				<Grid.Dropdown.Item title="Fit : 100-800" value={'fit'} />
			</Grid.Dropdown.Section>
		</Grid.Dropdown>
	);
	// create item copy action
	type itemCopyActionContent = React.ComponentProps<typeof Action.CopyToClipboard>['content'];
	type itemCopyActionTitle = React.ComponentProps<typeof Action.CopyToClipboard>['title'];
	const itemCopyAction = (content: itemCopyActionContent, title: itemCopyActionTitle) => (
		<Action.CopyToClipboard content={content} title={`Copy ${title}`} />
	);
	// create item paste action
	type itemPasteActionContent = React.ComponentProps<typeof Action.Paste>['content'];
	type itemPasteActionTitle = React.ComponentProps<typeof Action.Paste>['title'];
	const itemPasteAction = (content: itemPasteActionContent, title: itemPasteActionTitle) => (
		<Action.Paste content={content} title={`Paste ${title}`} />
	);
	// set item  type
	type item = (color: string, shade: string, hex: string) => JSX.Element;
	// create primary action
	const itemAction1: item = (color, shade, hex) =>
		(preferences.primaryAction === 'copy' ? itemCopyAction : itemPasteAction)(
			preferences.primaryValue === 'color' ? `${color}-${shade}` : hex,
			preferences.primaryValue === 'color' ? 'Color' : 'Hex'
		);
	// create secondary action
	const itemAction2: item = (color, shade, hex) =>
		(preferences.primaryAction === 'copy' ? itemCopyAction : itemPasteAction)(
			preferences.primaryValue === 'color' ? hex : `${color}-${shade}`,
			preferences.primaryValue === 'color' ? 'Hex' : 'Color'
		);
	// create tertiary action
	const itemAction3: item = (color, shade, hex) =>
		(preferences.primaryAction === 'copy' ? itemPasteAction : itemCopyAction)(
			preferences.primaryValue === 'color' ? `${color}-${shade}` : hex,
			preferences.primaryValue === 'color' ? 'Color' : 'Hex'
		);
	// create quaternary action
	const itemAction4: item = (color, shade, hex) =>
		(preferences.primaryAction === 'copy' ? itemPasteAction : itemCopyAction)(
			preferences.primaryValue === 'color' ? hex : `${color}-${shade}`,
			preferences.primaryValue === 'color' ? 'Hex' : 'Color'
		);
	// create item action panel
	const itemActionPanelCopyPasteSection = (color: string, shade: string, hex: string) => (
		<>
			{itemAction1(color, shade, hex)}
			{itemAction2(color, shade, hex)}
			{itemAction3(color, shade, hex)}
			{itemAction4(color, shade, hex)}
		</>
	);
	// create action panel
	const itemActionPanel = (color: string, shade: string, hex: string) => (
		<ActionPanel>
			<ActionPanel.Section>{itemActionPanelCopyPasteSection(color, shade, hex)}</ActionPanel.Section>
		</ActionPanel>
	);
	// create grid item
	const item: item = (color, shade, hex) => (
		<Grid.Item
			key={shade}
			content={{ color: hex }}
			title={shade}
			subtitle={hex}
			keywords={[color, hex, hex.slice(1)]}
			actions={itemActionPanel(color, shade, hex)}
		></Grid.Item>
	);
	// create ui component
	return (
		<Grid
			itemSize={size === 'fit' ? Grid.ItemSize.Small : size}
			actions={defaultActionPanel}
			searchBarAccessory={searchBarDropdown}
		>
			{size === 'fit'
				? colorShades.flatMap(({ color, shades }) =>
						shades.flatMap(({ shade, hex }) =>
							shade === '50' || shade === '900'
								? []
								: [
										<Grid.Item
											key={`${color}-${shade}`}
											content={{ color: hex }}
											title={`${color}-${shade}`}
											subtitle={hex}
											keywords={[color, shade, hex, hex.slice(1)]}
											actions={itemActionPanel(color, shade, hex)}
										></Grid.Item>,
								  ]
						)
				  )
				: colorShades.map(({ color, shades }) => (
						<Grid.Section key={color} title={color.charAt(0).toUpperCase() + color.slice(1)}>
							{(size === Grid.ItemSize.Small
								? shades.slice(1, 9)
								: size === Grid.ItemSize.Large
								? shades.slice(1)
								: shades
							).map(({ shade, hex }) => (
								<Grid.Item
									key={shade}
									content={{ color: hex }}
									title={shade}
									subtitle={hex}
									keywords={[color, hex, hex.slice(1)]}
									actions={itemActionPanel(color, shade, hex)}
								></Grid.Item>
							))}
						</Grid.Section>
				  ))}
		</Grid>
	);
};

// render ui component
export default SearchColors;
// export default <Detail markdown={JSON.stringify(colorShades || ['Search Colors Debug'])} />;
