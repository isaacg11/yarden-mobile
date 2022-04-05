import React, {Component} from 'react';
import {View} from 'react-native';
import Link from '../UI/Link';
import Paragraph from '../UI/Paragraph';
import Ionicons from 'react-native-vector-icons/Ionicons';
import fonts from '../styles/fonts';
import units from '../styles/units';

class Table extends Component {
  renderColumns(row) {
    let columns = [];
    for (const column in row) {
      if (column === 'url') {
        columns.push({url: row[column]});
      } else {
        const text =
          column === 'price' ? `$${row[column].toFixed(2)}` : row[column];
        columns.push({text: text});
      }
    }

    return columns.map((column, index) => {
      // // if link {...}
      if (column.url) {
        // render link
        return (
          <View
            style={{
              flex: 1,
              alignSelf: 'stretch',
              padding: units.unit3,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            key={index}>
            <Paragraph numberOfLines={3}>
              <Link
                url={column.url}
                text={<Ionicons name="globe" size={fonts.h2} />}
              />
            </Paragraph>
          </View>
        );
      } else {
        // render text
        return (
          <View
            style={{
              flex: 1,
              alignSelf: 'stretch',
              padding: units.unit3,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            key={index}>
            <Paragraph numberOfLines={3}>{column.text}</Paragraph>
          </View>
        );
      }
    });
  }

  renderRow(row, index) {
    return (
      <View
        style={{
          flex: 1,
          alignSelf: 'stretch',
          flexDirection: 'row',
          borderBottomColor: '#ddd',
          borderBottomWidth: 1,
          paddingVertical: units.unit2,
        }}
        key={index}>
        {this.renderColumns(row)}
      </View>
    );
  }

  renderHeaders(row) {
    let columns = [];
    for (const column in row) {
      columns.push({header: column});
    }

    return columns.map((column, index) => {
      return (
        <View style={{flex: 1, alignSelf: 'stretch', padding: 5}} key={index}>
          <Paragraph
            numberOfLines={3}
            style={{fontWeight: 'bold', alignItems: 'center'}}>
            {column.header}
          </Paragraph>
        </View>
      );
    });
  }

  render() {
    const {data} = this.props;

    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View
          style={{
            flex: 1,
            alignSelf: 'stretch',
            flexDirection: 'row',
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
            paddingTop: 12,
            paddingBottom: 12,
          }}>
          {this.renderHeaders(data[0])}
        </View>
        {data.map((datum, index) => {
          return this.renderRow(datum, index);
        })}
      </View>
    );
  }
}

module.exports = Table;
