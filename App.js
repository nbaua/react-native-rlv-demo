// import { Card, theme } from "galio-framework";
import React, { Component } from "react";
import { ActivityIndicator, Dimensions, Image, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { DataProvider, LayoutProvider, RecyclerListView } from "recyclerlistview";
import { fakeServer } from "./fakeServer";

class App extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			dataProvider: new DataProvider((r1, r2) => {
				return r1 !== r2;
			}),
			fakeData: [],
		};
	}

	_layoutProvider = new LayoutProvider(
		(index) => {
			if (index % 2 == 0) {
				return "RIGHT";
			} else {
				return "LEFT";
			}
			// return index;
		},
		(type, dim) => {
			dim.width = Dimensions.get("window").width;
			dim.height = 140;
		}
	);

	_rowRenderer = (type, data) => {
		/**** STYLE 1 - ZIG ZAG ****/
		if (type == "LEFT") {
			return (
				<View style={{ ...styles.rowItem, flexDirection: "row" }}>
					<View style={{ ...styles.oneFourth }}>
						<Image source={{ uri: data.image_url }} style={{ ...styles.thumbnailLeft }} />
					</View>
					<View style={{ ...styles.threeFourth }}>
						<Text style={{ ...styles.title }}>{data.name}</Text>
						<Text style={{ ...styles.detail }}>{data.sku}</Text>
						<Text style={{ ...styles.detail }}>{data.category}</Text>
						<Text style={{ ...styles.detail }}>Price: ${data.price}</Text>
					</View>
				</View>
			);
		} else {
			return (
				<View style={{ ...styles.rowItem, flexDirection: "row" }}>
					<View style={{ ...styles.threeFourth }}>
						<Text style={{ ...styles.title }}>{data.name}</Text>
						<Text style={{ ...styles.detail }}>{data.sku}</Text>
						<Text style={{ ...styles.detail }}>{data.category}</Text>
						<Text style={{ ...styles.detail }}>Price: ${data.price}</Text>
					</View>
					<View style={{ ...styles.oneFourth }}>
						<Image source={{ uri: data.image_url }} style={{ ...styles.thumbnail }} />
					</View>
				</View>
			);
		}

		/**** STYLE 2 - EVEN-ODD ****/
		// return (
		// 	<View style={{ ...(type == "LEFT" ? styles.oddRowItem : styles.evenRowItem) }}>
		// 		<View style={{ ...styles.oneFourth }}>
		// 			<Image source={{ uri: data.image_url }} style={{ ...styles.thumbnail }} />
		// 		</View>
		// 		<View style={{ ...styles.threeFourth }}>
		// 			<Text style={{ ...styles.title }}>{data.name}</Text>
		// 			<Text style={{ ...styles.detail }}>{data.sku}</Text>
		// 			<Text style={{ ...styles.detail }}>{data.category}</Text>
		// 			<Text style={{ ...styles.detail }}>Price: ${data.price}</Text>
		// 		</View>
		// 	</View>
		// );
		/**** STYLE 3 - GALIO-CARD ****/
		// return (
		// 	<Card
		// 		flex
		// 		borderless
		// 		style={styles.card}
		// 		title={data.name}
		// 		caption={data.sku}
		// 		location={"$" + data.price}
		// 		// avatar="http://i.pravatar.cc/100?id=skater"
		// 		avatar={data.image_url}
		// 		imageStyle={styles.cardImageRadius}
		// 		imageBlockStyle={{ padding: theme.SIZES.BASE / 2, width: 150, alignSelf: "center" }}
		// 		image={data.image_url}
		// 	/>
		// );
	};

	ListFooterComponent = () => (
		<Text
			style={{
				fontSize: 16,
				fontWeight: "bold",
				textAlign: "center",
				padding: 5,
			}}
		>
			Loading...
		</Text>
	);

	fetchData = async (qty) => {
		const response = await fakeServer(qty);
		// console.log(response);

		if (response === "done") return;
		this.setState({
			...this.state,
			dataProvider: this.state.dataProvider.cloneWithRows([...this.state.fakeData, ...response]),
			fakeData: [...this.state.fakeData, ...response],
		});
	};

	fetchMoreData = async () => {
		await this.fetchData(50);
	};

	componentDidMount() {
		this._isMounted = true;
		this.fetchData(50);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		if (!this._isMounted) {
			return <Text>Loading...</Text>;
		}

		return (
			<SafeAreaView style={styles.container}>
				<StatusBar animated={true} backgroundColor="#61dafb" />
				<RecyclerListView
					style={{ ...styles.list }}
					rowRenderer={this._rowRenderer}
					dataProvider={this.state.dataProvider}
					layoutProvider={this._layoutProvider}
					onEndReached={this.fetchMoreData}
					onEndReachedThreshold={0.5}
					renderFooter={this.renderFooter}
				/>
			</SafeAreaView>
		);
	}

	renderFooter() {
		if (!this._isMounted) {
			return (
				<View
					style={{
						flexDirection: "column",
					}}
				>
					<ActivityIndicator style={{ backgroundColor: "#f1f1f1", flex: 0.5, padding: 10 }} size="large" color="#999999" />
					<View style={{ backgroundColor: "#f1f1f1", flex: 0.5 }}>
						<Text style={{ textAlign: "center", color: "#999999", padding: 10 }}>Loading.... Please Wait!</Text>
					</View>
				</View>
			);
			//return <Text style={{ ...styles.loading }}>Loading...</Text>;
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	list: {
		width: "100%",
		height: "100%",
		marginBottom: 0,
		// backgroundColor: "#feddef",
	},
	rowItem: {
		flexDirection: "row",
		borderBottomWidth: 2,
		borderColor: "#decade",
		padding: 10,
	},
	oddRowItem: {
		flexDirection: "row",
		borderBottomWidth: 2,
		borderColor: "#dedede",
		padding: 10,
		backgroundColor: "#fafafa",
	},
	evenRowItem: {
		flexDirection: "row",
		borderBottomWidth: 2,
		borderColor: "#dedede",
		padding: 10,
		backgroundColor: "#ffffee",
	},
	loading: {
		flex: 1,
		backgroundColor: "#dadada",
		textAlign: "center",
		fontSize: 24,
		color: "red",
		padding: 5,
		width: "100%",
		height: 40,
	},
	thumbnail: {
		width: 90,
		height: 120,
		borderWidth: 5,
		borderColor: "#dadada",
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		borderBottomRightRadius: 30,
		borderBottomLeftRadius: 60,
	},
	thumbnailLeft: {
		width: 90,
		height: 120,
		borderWidth: 5,
		borderColor: "#dadada",
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		borderBottomRightRadius: 60,
		borderBottomLeftRadius: 30,
	},
	cardImageRadius: {
		borderWidth: 1,
		borderRadius: 5,
	},
	oneFourth: {
		flex: 0.25,
		flexDirection: "column",
	},
	threeFourth: {
		flex: 0.75,
		flexDirection: "column",
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		// textDecorationLine: "underline",
		color: "#333333",
	},
	detail: {
		fontSize: 16,
		fontWeight: "100",
		color: "#666666",
	},
});

export default App;
