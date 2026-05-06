import pickle
import numpy as np
from pathlib import Path
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

class TicketModelHandler:
    def __init__(self):
        # Adjusted paths to be relative to the root folder
        self.models_base = Path(__file__).parent.parent / 'models'
        self.sbert = None
        self.cat_model = None
        self.cat_le = None
        self.team_model = None
        self.team_le = None
        self.priority_model = None
        self.priority_le = None
        self.ttr_model = None
        self.ttr_le = None
        self.ttr_ohe = None
        self.kb_df = None
        self.kb_embeddings = None

    def load_models(self):
        print("🚀 Loading AI Models into memory...")
        self.sbert = SentenceTransformer('all-MiniLM-L6-v2')

        # Phase 2: Category
        self.cat_model = pickle.load(open(self.models_base/'category_classifier'/'sbert_classifier.pkl', 'rb'))
        self.cat_le = pickle.load(open(self.models_base/'category_classifier'/'label_encoder.pkl', 'rb'))

        # Phase 3: Team and Priority
        self.team_model = pickle.load(open(self.models_base/'team_priority_classifier'/'team_classifier.pkl', 'rb'))
        self.team_le = pickle.load(open(self.models_base/'team_priority_classifier'/'le_team.pkl', 'rb'))
        self.priority_model = pickle.load(open(self.models_base/'team_priority_classifier'/'priority_classifier.pkl', 'rb'))
        self.priority_le = pickle.load(open(self.models_base/'team_priority_classifier'/'le_priority.pkl', 'rb'))

        # Phase 4: Resolution Time
        self.ttr_model = pickle.load(open(self.models_base/'resolution_time_predictor'/'ttr_model.pkl', 'rb'))
        self.ttr_le = pickle.load(open(self.models_base/'resolution_time_predictor'/'ttr_le.pkl', 'rb'))
        try:
            self.ttr_ohe = pickle.load(open(self.models_base/'resolution_time_predictor'/'ttr_ohe.pkl', 'rb'))
        except:
            print("⚠️ ttr_ohe.pkl not found. ETA will be calculated with basic features.")

        # Phase 5: Action Knowledge Base
        kb_data = pickle.load(open(self.models_base/'action_generator'/'action_kb_index.pkl', 'rb'))
        self.kb_df = kb_data['knowledge_base']
        self.kb_embeddings = kb_data['embeddings']
        
        print("✅ All Models Loaded Successfully.")

    def _detect_language(self, text: str):
        text_lower = text.lower()
        # Basic German detection (vowels and common words)
        german_indicators = ['ä', 'ö', 'ü', 'ß', 'der ', 'die ', 'das ', 'und ', 'ich ', 'sie ']
        if any(indicator in text_lower for indicator in german_indicators):
            return 'German'
        return 'English'

    def predict(self, description: str):
        # 1. Embed
        emb = self.sbert.encode([description])
        input_lang = self._detect_language(description)

        # 2. Category
        cat_probs = self.cat_model.predict_proba(emb)[0]
        cat_idx = np.argmax(cat_probs)
        category = self.cat_le.inverse_transform([cat_idx])[0]
        confidence = float(cat_probs[cat_idx])

        # 3. Team & Priority
        team = self.team_le.inverse_transform(self.team_model.predict(emb))[0]
        priority = self.priority_le.inverse_transform(self.priority_model.predict(emb))[0]

        # 4. ETA
        eta = "N/A"
        if self.ttr_ohe:
            meta_feat = self.ttr_ohe.transform([[priority, category]])
            hybrid_feat = np.hstack([emb, meta_feat])
            eta = self.ttr_le.inverse_transform(self.ttr_model.predict(hybrid_feat))[0]

        # 5. Smart Action Retrieval (with Language Filtering)
        # Helper to classify KB entries by language if not already present
        def get_lang(x):
            x = str(x).lower()
            if any(c in x for c in ['ä','ö','ü','ß','der ','die ','das ']): return 'German'
            return 'English'

        # Filter KB to match input language
        kb_df_filtered = self.kb_df.copy()
        kb_df_filtered['lang'] = kb_df_filtered['action'].apply(get_lang)
        lang_mask = (kb_df_filtered['lang'] == input_lang).values
        
        # Calculate similarity on the filtered set
        filtered_embeddings = self.kb_embeddings[lang_mask]
        if len(filtered_embeddings) > 0:
            scores = cosine_similarity(emb, filtered_embeddings).flatten()
            best_idx = np.argmax(scores)
            action = kb_df_filtered[lang_mask].iloc[best_idx]['action']
        else:
            # Fallback to unfiltered if something goes wrong
            scores = cosine_similarity(emb, self.kb_embeddings).flatten()
            action = self.kb_df.iloc[np.argmax(scores)]['action']

        # 6. Routing Logic
        status = "AUTO-DISPATCH"
        if confidence < 0.75: status = "MANUAL-REVIEW"
        if confidence < 0.50 or priority == 'high': status = "URGENT-ESCALATION"

        return {
            "category": str(category),
            "confidence": round(confidence, 4),
            "team": str(team),
            "priority": str(priority),
            "eta": str(eta),
            "suggested_action": str(action),
            "routing_status": status
        }
