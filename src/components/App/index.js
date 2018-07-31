import React from 'react';
import Chart from './Chart';
import { getData } from "./utils"

import { TypeChooser } from "react-stockcharts/lib/helper";


class App extends React.Component {
	componentDidMount() {
		console.log(this)
		let ticker = this.props.location.query.ticker
		let startDate = parseInt(this.props.location.query.start_date)
		let endDate = parseInt(this.props.location.query.end_date)

		if (ticker != null && endDate > startDate) {
			getData(ticker, startDate, endDate).then(data => {
				this.setState({ data })
			})
		}
	}
	render() {
		if (this.state == null) {
			return <div>Loading...</div>
		}
		return (
			<TypeChooser>
				{type => <Chart type={type} data={this.state.data} />}
			</TypeChooser>
		)
	}
}

export default App;
