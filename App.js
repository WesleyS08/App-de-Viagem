import { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Platform, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Linking } from 'react-native';

const statusBarHeight = StatusBar.currentHeight;
const API_KEY = 'Sua Chave';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

// Configuração do calendário para exibir em português
LocaleConfig.locales['pt'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt';

const countDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export default function App() {
  const [city, setCity] = useState('');
  const [days, setDays] = useState(5);
  const [loading, setLoading] = useState(false);
  const [travel, setTravel] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);

  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(API_KEY); // Using environment variable

  const resetAll = () => {
    setCity('');
    setDays(5);
    setTravel('');
    setSelectedStartDate('');
    setSelectedEndDate('');
    setMarkedDates({});
    setShowCalendar(false);
  };


  const handleGenerate = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
      Eu gostaria de um roteiro detalhado de viagem para ${city}, durante ${days} dias, e caso as informacoes de ${formatDate(selectedStartDate)} estejam vazias ignore essa parte ()
      O período da viagem é de ${formatDate(selectedStartDate)} até ${formatDate(selectedEndDate)}.
      Por favor, inclua informações sobre eventos que estarão acontecendo durante esse período nessa cidade.
      Além disso, me fale alguma questões como valor da passagem(de ônibus), prato tipico e etc.
      e se por um acaso nao for enviado o nome da cidade,  quero que me responda " sinto muito preciso de uma cidade" 
  `;


      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log('Resposta da API:', text);
      setTravel(text);
    } catch (error) {
      Alert.alert('Erro', `Não foi possível gerar o roteiro. Detalhes: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markDates = (startDate, endDate) => {
    const dates = {};
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
      const dateString = dt.toISOString().split('T')[0];
      dates[dateString] = { selected: true, marked: true, selectedColor: '#812B8C' };
    }

    return dates;
  };

  const handleDayPress = (day) => {
    const selectedDate = new Date(day.dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Alert.alert('Atenção', 'Você não pode selecionar uma data que já passou.');
      return;
    }

    if (!selectedStartDate || (selectedEndDate && selectedStartDate)) {
      setSelectedStartDate(day.dateString);
      setSelectedEndDate('');
    } else {
      if (selectedDate < new Date(selectedStartDate)) {
        Alert.alert('Atenção', 'A data final não pode ser anterior à data inicial.');
        return;
      }
      setSelectedEndDate(day.dateString);
      const marked = markDates(selectedStartDate, day.dateString);
      setMarkedDates(marked);
      const totalDays = countDays(selectedStartDate, day.dateString);
      setDays(totalDays);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#f1f1f1" />
      <Text style={styles.heading}>Explorando o Mundo de uma forma fácil</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Cidade destino</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Ex: São Paulo, SP"
            style={styles.input}
            value={city}
            onChangeText={(text) => setCity(text)}
          />
          <Pressable style={styles.resetButton} onPress={resetAll}>
            <MaterialIcons name="refresh" size={24} color="#FFF" />
          </Pressable>
        </View>

        <Text style={styles.label}>
          Tempo de estadia: <Text style={styles.days}>{days.toFixed(0)}</Text> dias
        </Text>
        <Slider
          minimumValue={1}
          maximumValue={30}
          minimumTrackTintColor="#b05d8d"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#61094d"
          value={days}
          onValueChange={(value) => setDays(value)}
        />
        <Text style={styles.sub}>Ou selecione uma data</Text>

        <Pressable
          style={[styles.buttonCalendar, { marginBottom: 10 }]}
          onPress={() => setShowCalendar(prev => !prev)} // Alternando o estado corretamente
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>
              {showCalendar ? 'Ocultar Calendário' : 'Mostrar Calendário'}
            </Text>
            <MaterialIcons name={showCalendar ? 'arrow-drop-up' : 'arrow-drop-down'} size={24} color="#FFF" />
          </View>
        </Pressable>

        {showCalendar && (
          <View style={styles.calendarContainer}>
            <Calendar
              markingType={'multi-dot'}
              markedDates={markedDates}
              onDayPress={handleDayPress}
            />
            {selectedStartDate && selectedEndDate ? (
              <Text>Período selecionado: {formatDate(selectedStartDate)} até {formatDate(selectedEndDate)}</Text>
            ) : selectedStartDate ? (
              <Text>Data inicial selecionada: {formatDate(selectedStartDate)}</Text>
            ) : null}
          </View>
        )}
      </View>

      <Pressable style={styles.button} onPress={handleGenerate} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <Text style={styles.buttonText}>Gerar roteiro</Text>
        )}
        <MaterialIcons name="travel-explore" size={24} color="#FFF" style={{ marginLeft: 10 }} />
      </Pressable>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={styles.content}>
            <Text style={styles.title}>Carregando roteiro...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {travel && (
          <View style={styles.content}>
            <Text style={styles.title}>Roteiro Gerado 👇</Text>
            {travel.split('\n').map((line, index) => (
              <Text key={index} style={styles.travel}>
                {line.split(/(\*\*.*?\*\*)/g).map((part, idx) => {
                  const isBold = part.startsWith('**') && part.endsWith('**');
                  const text = isBold ? part.replace(/\*\*/g, '') : part; // Remove os asteriscos

                  return isBold ? (
                    <Text key={idx} style={{ fontWeight: 'bold' }}>
                      {text}
                    </Text>
                  ) : (
                    text
                  );
                })}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 0,
  },
  heading: {
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 35,
    marginBottom: 20,
    textAlign: 'center'
  },
  form: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
    color: '#333',
  },
  resetButton: {
    backgroundColor: '#812B8C',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  days: {
    color: '#812B8C',
    fontWeight: 'bold',
  },
  sub: {
    fontSize: 14,
    marginVertical: 8,
  },
  buttonCalendar: {
    backgroundColor: '#812B8C',
    padding: 10,
    borderRadius: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    MarginLeft: 4,
    color: '#FFF',
    fontWeight: 'bold',
  },
  calendarContainer: {
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  button: {
    backgroundColor: '#812B8C',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: '90%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  containerScroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  content: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  travel: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
  },

});