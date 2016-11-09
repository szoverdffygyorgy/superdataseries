module.exports = c3.generate({
	bindto: '#forex_chart',
	data: {
		x: 'x',
		xFormat: '%Y-%m-%d %H:%M:%S',
		mimeType: 'csv',
		url: './forex_data_test',
		groups: [
			['HUF/USD']
		],
		keys: {
			xFormat: '%Y-%m-%d %H:%M:%S'
		}

	},
	axis: {
		y: {
			label: {
				text: 'Price',
				position: 'outer-middle'
			}
		},
		x: {
			type: 'timeseries',
			label: {
				text: 'Time',
				position: 'middle'
			},
			tick: {
				format: '%H:%M:%S'
			}
		}
	}
});